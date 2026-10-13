# Five-year TCO accounting

All money is TWD. Calculations use unrounded inputs, then round display outputs
once to whole dollars. Displayed components may differ from the rounded total
by a few dollars due to rounding. The horizon is fixed at five years.

Economic TCO = starting vehicle value - terminal resale + fuel + maintenance +
insurance + taxes + financing interest/fees + other costs.

- Buy: starting value is purchase price.
- Keep: starting value is the vehicle's current market value (opportunity cost),
  not the historical purchase expense.
- Fuel = annual_km / km_per_litre * fuel_price * 5.
- Annual expense inputs are multiplied by five; financing cost is already the
  five-year total, excluding principal (principal is captured in purchase price).
- Trade-in affects funding, not economic TCO: acquisition cash = purchase -
  trade-in in buy mode, zero in keep mode.
- Future net cash = acquisition cash + running costs - terminal resale.
  This assumes outright acquisition plus separately entered finance costs; it
  is not a monthly loan cash-flow schedule. A negative net cash value is possible
  if terminal resale exceeds future operating expenditures for a kept car.
- Low/high scenarios change fuel and maintenance by -/+20% only. No statistical
  confidence is implied; residual, insurance, taxes and other inputs stay fixed.

Defaults: 15,000 km/year, TWD 32/L, insurance 20,000/year, tax 15,000/year,
maintenance 15,000/year, other/finance 0. Buy resale is 40% of the source price;
keep current value is 500,000 and resale 200,000. These are intentionally labeled
example assumptions, not vehicle-specific forecasts or actual statutory taxes.
The UI lets users replace every input; it never declares switching cheaper by
subtracting trade-in twice. No discount rate, inflation, unexpected repairs,
loan amortization, EV charging or tax lookup is modeled.
