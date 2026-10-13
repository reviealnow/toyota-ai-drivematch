from copy import deepcopy
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from backend.app.schemas import TCOInput, Preferences, Spec
from backend.app.catalog import get_catalog, validate_catalog
from backend.app.engines import tco, rank
from backend.app.main import app

client = TestClient(app)

def test_hand_calculated_tco():
    r=tco(TCOInput(purchase_price=1000000,residual_value=400000,annual_km=15000,fuel_efficiency=15,fuel_price=30,annual_insurance=20000,annual_tax=10000,annual_maintenance=10000))
    assert r['total']==950000
    assert r['annual']==190000
    assert r['breakdown']['fuel']==150000
    assert r['scenarios']=={'low':910000,'base':950000,'high':990000}

def test_keep_excludes_sunk_price():
    a=TCOInput(mode='keep',current_value=500000,residual_value=200000,purchase_price=1000000,trade_in=0)
    r=tco(a)
    assert r==tco(a.model_copy(update={'purchase_price':9000000,'trade_in':300000}))
    assert r['acquisition_cash']==0
    assert r['total']-r['future_net_cash']==500000

def test_trade_in_is_cash_only():
    a=TCOInput(trade_in=0); b=TCOInput(trade_in=300000)
    assert tco(a)['total']==tco(b)['total']
    assert tco(a)['future_net_cash']-tco(b)['future_net_cash']==300000
    assert tco(a)['acquisition_cash']-tco(b)['acquisition_cash']==300000

@pytest.mark.parametrize('data',[{'fuel_efficiency':0},{'annual_km':-1},{'fuel_price':float('nan')},{'residual_value':1000001},{'trade_in':1000001},{'mode':'invalid'}])
def test_invalid_cost_inputs(data):
    with pytest.raises(ValidationError): TCOInput(**data)

def test_zero_mileage_has_no_fuel_cost():
    assert tco(TCOInput(annual_km=0))['breakdown']['fuel']==0

def test_no_eligible_seven_seats():
    r=rank(get_catalog(),Preferences(seats=7))
    assert not r['has_eligible']
    assert len(r['results'])==3
    assert all(not v['eligible'] and any('人' in s for s in v['violations']) for v in r['results'])

def test_budget_filter_precedes_rank():
    r=rank(get_catalog(),Preferences(budget=900000))
    assert r['has_eligible']
    assert [x['vehicle']['id'] for x in r['results']]==['toyota-cross-luxury']

def test_no_budget_matches_discloses_violation():
    r=rank(get_catalog(),Preferences(budget=0))
    assert not r['has_eligible']
    assert all(x['violations'] for x in r['results'])

def test_missing_seats_is_not_eligible():
    cars=deepcopy(get_catalog())
    for c in cars:c.specs['seats']=Spec(value=None,unit='人',status='missing')
    r=rank(cars,Preferences())
    assert not r['has_eligible']
    assert all('座位數待確認' in x['violations'] for x in r['results'])

def test_missing_fuel_no_fabricated_tco():
    cars=deepcopy(get_catalog())
    for c in cars:c.specs['fuel']=Spec(value=None,unit='km/L',status='missing')
    r=rank(cars,Preferences())
    assert all(x['components']['fuel']==0 and x['estimated_tco'] is None for x in r['results'])

def test_ranking_stable_bounded_and_explainable():
    a=rank(get_catalog(),Preferences())
    b=rank(list(reversed(get_catalog())),Preferences())
    assert a==b
    assert all(0<=x['score']<=100 and x['explanation'] for x in a['results'])
    assert len({x['vehicle']['model'] for x in a['results']})==len(a['results'])

def test_preference_changes_ranking():
    fuel=rank(get_catalog(),Preferences(priority='fuel'))
    price=rank(get_catalog(),Preferences(priority='price'))
    assert fuel['results'][0]['vehicle']['model']=='RAV4'
    assert price['results'][0]['vehicle']['model']=='COROLLA CROSS'

def test_unsupported_priority_is_disclosed():
    r=rank(get_catalog(),Preferences(priority='comfort'))
    assert any('缺乏' in t for t in r['results'][0]['tradeoffs'])

def test_verified_data_requires_provenance():
    with pytest.raises(ValidationError): Spec(value=10,unit='km/L',status='verified')

def test_duplicate_catalog_ids_rejected():
    v=get_catalog()[0].model_dump(mode='json')
    with pytest.raises(ValueError):validate_catalog([v,v])

def test_api_journey():
    catalog=client.get('/api/vehicles')
    assert catalog.status_code==200
    assert catalog.headers['x-request-id']
    assert catalog.json()[0]['model']=='CR-V'
    rec=client.post('/api/recommendations',json={'current_id':'honda-crv-vtis'})
    assert rec.status_code==200 and len(rec.json()['results'])==3
    assert client.post('/api/tco',json={}).status_code==200
    assert client.post('/api/tco',json={'fuel_efficiency':0}).status_code==422
    assert client.post('/api/recommendations',json={'current_id':'unknown'}).status_code==422
