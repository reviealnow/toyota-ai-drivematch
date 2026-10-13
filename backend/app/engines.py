from .schemas import Preferences, TCOInput, Vehicle

YEARS = 5

def tco(i: TCOInput):
    capital = i.purchase_price if i.mode == 'buy' else i.current_value
    breakdown = {
        'depreciation': capital - i.residual_value,
        'fuel': YEARS * i.annual_km / i.fuel_efficiency * i.fuel_price,
        'maintenance': YEARS * i.annual_maintenance,
        'insurance': YEARS * i.annual_insurance,
        'tax': YEARS * i.annual_tax,
        'financing': i.financing_cost,
        'other': YEARS * i.annual_other,
    }
    total = sum(breakdown.values())
    running = total - breakdown['depreciation']
    # Trade-in changes cash funding only; subtracting it from depreciation would
    # count an existing asset twice in an economic ownership-cost comparison.
    acquisition_cash = i.purchase_price - i.trade_in if i.mode == 'buy' else 0
    return {
        'total': round(total), 'annual': round(total / YEARS),
        'breakdown': {k: round(v) for k,v in breakdown.items()},
        'acquisition_cash': round(acquisition_cash),
        'future_net_cash': round(acquisition_cash + running - i.residual_value),
        'scenarios': {
            'low': round(total - breakdown['fuel'] * .2 - breakdown['maintenance'] * .2),
            'base': round(total),
            'high': round(total + breakdown['fuel'] * .2 + breakdown['maintenance'] * .2),
        },
        'assumptions': '五年固定里程、油價與年度費用；低／高情境僅將燃油與保養費調整 ±20%，非機率預測。',
    }

def number(v: Vehicle, key: str):
    s = v.specs.get(key)
    return s.value if s and s.status == 'verified' and isinstance(s.value, (float,int)) else None

def rank(vehicles: list[Vehicle], p: Preferences):
    weights = {'price': .4, 'fuel': .4, 'space': .2}
    if p.priority in weights:
        weights = {k: (.6 if k == p.priority else .2) for k in weights}
    rows = []
    for v in vehicles:
        if v.brand != 'TOYOTA':
            continue
        price, fuel, seats = (number(v,k) for k in ['price','fuel','seats'])
        violations = []
        if price is None: violations.append('售價待確認，無法驗證預算')
        elif price > p.budget: violations.append(f'超出預算 NT$ {price-p.budget:,.0f}')
        if seats is None: violations.append('座位數待確認')
        elif seats < p.seats: violations.append(f'僅 {seats:.0f} 人座，不符合 {p.seats} 人需求')
        scores = {
            'price': max(0,min(100,(1-price/max(p.budget,1))*100)) if price is not None else 0,
            'fuel': max(0,min(100,(fuel-8)/22*100)) if fuel is not None else 0,
            'space': min(100,seats/p.seats*100) if seats is not None else 0,
        }
        score = round(sum(scores[k]*weights[k] for k in weights),1)
        fuel_cost = round(p.annual_km/fuel*32) if fuel else None
        explanation = [f'價格／油耗／座位適配分數：{scores["price"]:.0f}／{scores["fuel"]:.0f}／{scores["space"]:.0f}。']
        if fuel_cost is not None: explanation.append(f'依每年 {p.annual_km:,.0f} km、示例油價 NT$ 32/L，年燃油約 NT$ {fuel_cost:,.0f}。')
        tradeoffs = ['座位數不代表乘坐舒適度；安全系統名稱不代表安全評分。']
        if p.priority not in weights: tradeoffs.append('目前缺乏可量化的此項偏好資料，以價格、油耗與座位排序；請實車確認。')
        if fuel is None: tradeoffs.append('油耗資料缺漏，油耗得分為 0，無法估算成本。')
        estimate = tco(TCOInput(purchase_price=price, residual_value=price*.4, fuel_efficiency=fuel, annual_km=p.annual_km))['total'] if price and fuel else None
        rows.append(dict(vehicle=v.model_dump(mode='json'), score=score, eligible=not violations,
                         violations=violations, explanation=explanation, tradeoffs=tradeoffs,
                         components=scores, estimated_tco=estimate))
    eligible = [r for r in rows if r['eligible']]
    candidates = eligible or rows
    candidates.sort(key=lambda r: (len(r['violations']), -r['score'], r['vehicle']['id']))
    # At most one trim of each model in a top-three recommendation.
    unique = []
    for r in candidates:
        if r['vehicle']['model'] not in [x['vehicle']['model'] for x in unique]: unique.append(r)
    return {'results': unique[:3], 'has_eligible':bool(eligible), 'weights':weights,
            'notice':'規則配對分數不是購買建議。使用情境僅供討論，未納入未驗證的主觀評分；保留現有車也是選項。'}
