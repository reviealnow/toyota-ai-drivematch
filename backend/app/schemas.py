from datetime import date
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_validator

Money = Annotated[float, Field(ge=0, le=100_000_000, allow_inf_nan=False)]
class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)

class Spec(StrictModel):
    value: str | float | None
    unit: str
    status: Literal['verified', 'estimated', 'missing']
    source_url: HttpUrl | None = None
    retrieved_at: date | None = None
    verified_at: date | None = None
    market: Literal['TW'] = 'TW'
    note: str = ''
    @model_validator(mode='after')
    def provenance(self):
        if self.status == 'missing' and self.value is not None:
            raise ValueError('Missing fields must have null values')
        if self.status != 'missing' and self.value is None:
            raise ValueError('Non-missing fields require a value')
        if self.status == 'verified' and not all([self.source_url, self.retrieved_at, self.verified_at]):
            raise ValueError('Verified values require source and dates')
        if self.verified_at and self.verified_at > date.today():
            raise ValueError('Verification date is in the future')
        return self

class Vehicle(StrictModel):
    id: str = Field(pattern=r'^[a-z0-9-]+$')
    brand: str
    model: str
    year: int | None = Field(default=None, ge=1980, le=2100)
    trim: str
    edition: str
    body: Literal['休旅車', '轎車']
    specs: dict[str, Spec]
    @model_validator(mode='after')
    def specifications(self):
        required = {'price','fuel','seats','displacement','powertrain','safety','infotainment','dimensions','cargo','warranty'}
        if not required.issubset(self.specs):
            raise ValueError('Required spec keys missing')
        for key in ['price','fuel','seats','displacement','cargo']:
            v = self.specs[key].value
            if v is not None and (not isinstance(v, (float,int)) or v <= 0):
                raise ValueError(f'{key} must be a positive number or null')
        return self

class Preferences(StrictModel):
    current_id: str = 'honda-crv-vtis'
    budget: Money = 1_200_000
    seats: int = Field(default=5, ge=1, le=9)
    annual_km: float = Field(default=15000, ge=0, le=200000)
    usage: Literal['urban','highway','family','long','mixed'] = 'mixed'
    priority: Literal['price','fuel','space','safety','comfort','performance','maintenance'] = 'fuel'

class TCOInput(StrictModel):
    mode: Literal['buy','keep'] = 'buy'
    purchase_price: Money = 1_000_000
    current_value: Money = 500_000
    trade_in: Money = 0
    residual_value: Money = 400_000
    annual_km: float = Field(default=15000, ge=0, le=200000)
    fuel_efficiency: float = Field(default=15, gt=0, le=100)
    fuel_price: Money = 32
    annual_insurance: Money = 20000
    annual_tax: Money = 15000
    annual_maintenance: Money = 15000
    financing_cost: Money = 0
    annual_other: Money = 0
    @model_validator(mode='after')
    def accounting(self):
        capital = self.purchase_price if self.mode == 'buy' else self.current_value
        if self.residual_value > capital:
            raise ValueError('Residual value must not exceed the starting vehicle value')
        if self.mode == 'buy' and self.trade_in > self.purchase_price:
            raise ValueError('Trade-in exceeds purchase price')
        return self
