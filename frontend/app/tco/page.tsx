"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCatalog, CatalogStatus } from "@/components/Store";
import { api, money, TCOInput, TCOResult, Vehicle } from "@/lib/types";
const costNames: Record<string, string> = {
  depreciation: "折舊",
  fuel: "燃油",
  maintenance: "保養",
  insurance: "保險",
  tax: "稅費",
  financing: "融資利息與費用",
  other: "其他",
};
const fields: [keyof TCOInput, string][] = [
  ["residual_value", "五年後殘值"],
  ["fuel_efficiency", "燃油效率（km/L）"],
  ["annual_insurance", "每年保險"],
  ["annual_tax", "每年稅費"],
  ["annual_maintenance", "每年保養"],
  ["financing_cost", "五年融資利息與費用"],
  ["annual_other", "每年其他支出"],
];
function defaults(v: Vehicle, keep: boolean): TCOInput {
  return {
    mode: keep ? "keep" : "buy",
    purchase_price: Number(v.specs.price.value) || 0,
    current_value: 500000,
    trade_in: 0,
    residual_value: keep
      ? 200000
      : Math.round(Number(v.specs.price.value) * 0.4),
    annual_km: 15000,
    fuel_efficiency:
      v.specs.fuel.value === null ? NaN : Number(v.specs.fuel.value),
    fuel_price: 32,
    annual_insurance: 20000,
    annual_tax: 15000,
    annual_maintenance: 15000,
    financing_cost: 0,
    annual_other: 0,
  };
}
export default function TCO() {
  const { vehicles, current, selected } = useCatalog();
  const cars = useMemo(
    () =>
      [
        vehicles.find((v) => v.id === current),
        ...selected
          .filter((id) => id !== current)
          .map((id) => vehicles.find((v) => v.id === id)),
      ].filter((v): v is Vehicle => !!v),
    [vehicles, current, selected],
  );
  const [inputs, setInputs] = useState<Record<string, TCOInput>>({}),
    [results, setResults] = useState<Record<string, TCOResult>>({}),
    [annualKm, setAnnualKm] = useState(15000),
    [fuelPrice, setFuelPrice] = useState(32),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    setInputs((old) =>
      Object.fromEntries(
        cars.map((v, i) => [v.id, old[v.id] || defaults(v, i === 0)]),
      ),
    );
  }, [cars]);
  useEffect(() => {
    if (!cars.length || cars.some((v) => !inputs[v.id])) return;
    let active = true;
    setBusy(true);
    setError("");
    const timer = setTimeout(() => {
      Promise.all(
        cars.map(
          async (v) =>
            [
              v.id,
              await api<TCOResult>("tco", {
                ...inputs[v.id],
                annual_km: annualKm,
                fuel_price: fuelPrice,
              }),
            ] as const,
        ),
      )
        .then((entries) => {
          if (active) {
            setResults(Object.fromEntries(entries));
            setBusy(false);
          }
        })
        .catch((e) => {
          if (active) {
            setError(e.message);
            setBusy(false);
          }
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputs, cars, annualKm, fuelPrice, retry]);
  const set = (id: string, k: keyof TCOInput, v: number | string) =>
    setInputs({ ...inputs, [id]: { ...inputs[id], [k]: v } });
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">THE BIGGER PICTURE</span>
          <h1>不只買車，也看五年以後。</h1>
          <p className="muted">
            比較保留現有車與購買替代車款。調整假設，讓數字更接近你的生活。
          </p>
        </div>
        <Link className="button secondary" href="/compare">
          調整比較車款 ↗
        </Link>
      </div>
      <CatalogStatus />
      <div className="notice">
        以下為示例試算，非原廠報價或財務建議。舊車市值、殘值、油價、保險、稅費與保養均為可修改的假設，請填入你的實際金額。稅費未連接法定稅率資料。
      </div>
      <div className="panel global-inputs">
        <label className="field">
          每年行駛里程（km）
          <input
            type="number"
            min="0"
            max="200000"
            step="1000"
            value={Number.isFinite(annualKm) ? annualKm : ""}
            onChange={(e) => setAnnualKm(e.target.valueAsNumber)}
          />
        </label>
        <label className="field">
          燃油價格（TWD / L）
          <input
            type="number"
            min="0"
            max="100000000"
            step="0.1"
            value={Number.isFinite(fuelPrice) ? fuelPrice : ""}
            onChange={(e) => setFuelPrice(e.target.valueAsNumber)}
          />
        </label>
        <p className="muted">
          全車款共用這兩項假設。
          <br />
          金額單位皆為新台幣。
        </p>
      </div>
      {error && (
        <div className="notice danger" role="alert">
          {error} 殘值不得超過購車價或舊車市值，折抵不得超過購車價。
          <button onClick={() => setRetry(retry + 1)}>重新計算</button>
        </div>
      )}
      <div role="status" className="calculation-status">
        {busy ? "正在更新試算…" : error ? "請修正輸入後再試。" : "試算已更新"}
      </div>
      <div className="tco-scroll">
        <div
          className="tco-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.max(cars.length, 1)}, minmax(285px, 1fr))`,
          }}
        >
          {cars.map((v, index) => {
            const i = inputs[v.id],
              r = results[v.id];
            if (!i) return null;
            return (
              <article className="panel tco-card" key={v.id}>
                <span className="pill">
                  {index === 0 ? "目前車款" : "替代車款"}
                </span>
                <h2>{v.model}</h2>
                <p className="trim-label">{v.trim}</p>
                <label className="field">
                  持有方式
                  <select
                    value={i.mode}
                    onChange={(e) => {
                      const mode = e.target.value as "buy" | "keep";
                      setInputs({
                        ...inputs,
                        [v.id]: {
                          ...i,
                          mode,
                          residual_value:
                            mode === "keep"
                              ? Math.min(i.residual_value, i.current_value)
                              : Math.min(i.residual_value, i.purchase_price),
                        },
                      });
                    }}
                  >
                    <option value="keep">保留已持有車輛</option>
                    <option value="buy">購買車輛</option>
                  </select>
                </label>
                <div
                  className={`tco-total ${busy || error ? "pending" : ""}`}
                  aria-live="polite"
                >
                  <small>五年經濟持有成本</small>
                  <strong>{r && !error ? money(r.total) : "—"}</strong>
                  <span>
                    {r && !error
                      ? `平均每年 ${money(r.annual)}`
                      : "等待有效輸入"}
                  </span>
                </div>
                {r && !error && (
                  <>
                    <div
                      className="cost-bar"
                      role="img"
                      aria-label={Object.entries(r.breakdown)
                        .map(([k, val]) => `${costNames[k]} ${money(val)}`)
                        .join("，")}
                    >
                      {Object.entries(r.breakdown).map(([k, val], j) => (
                        <span
                          key={k}
                          className={`cost-${j}`}
                          style={{
                            width: `${r.total ? (val / r.total) * 100 : 0}%`,
                          }}
                          title={`${costNames[k]} ${money(val)}`}
                        />
                      ))}
                    </div>
                    <dl className="breakdown">
                      {Object.entries(r.breakdown).map(([k, val], j) => (
                        <div key={k}>
                          <dt>
                            <i className={`cost-${j}`} />
                            {costNames[k]}
                          </dt>
                          <dd>{money(val)}</dd>
                        </div>
                      ))}
                    </dl>
                    <details className="scenario">
                      <summary>低／基準／高成本情境</summary>
                      <dl className="breakdown">
                        {[
                          ["low", "低"],
                          ["base", "基準"],
                          ["high", "高"],
                        ].map(([k, l]) => (
                          <div key={k}>
                            <dt>{l}</dt>
                            <dd>
                              {money(
                                r.scenarios[k as keyof typeof r.scenarios],
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <small>{r.assumptions}</small>
                    </details>
                  </>
                )}
                <details className="assumptions" open>
                  <summary>調整這款車的假設</summary>
                  <label className="field">
                    {i.mode === "keep"
                      ? "舊車目前市值（非原始購車價）"
                      : "購車價格"}
                    <input
                      type="number"
                      min="0"
                      max="100000000"
                      value={
                        i.mode === "keep" ? i.current_value : i.purchase_price
                      }
                      onChange={(e) =>
                        set(
                          v.id,
                          i.mode === "keep"
                            ? "current_value"
                            : "purchase_price",
                          e.target.valueAsNumber,
                        )
                      }
                    />
                  </label>
                  {i.mode === "buy" && (
                    <label className="field">
                      出售舊車／折抵收入
                      <input
                        type="number"
                        min="0"
                        max="100000000"
                        value={i.trade_in}
                        onChange={(e) =>
                          set(v.id, "trade_in", e.target.valueAsNumber)
                        }
                      />
                    </label>
                  )}
                  {fields.map(([k, label]) => (
                    <label className="field" key={k}>
                      {label}
                      <input
                        type="number"
                        step={k === "fuel_efficiency" ? "0.1" : "1000"}
                        min={k === "fuel_efficiency" ? "0.1" : "0"}
                        max={k === "fuel_efficiency" ? "100" : "100000000"}
                        value={Number.isFinite(i[k]) ? (i[k] as number) : ""}
                        onChange={(e) => set(v.id, k, e.target.valueAsNumber)}
                      />
                    </label>
                  ))}
                </details>
                {r && !error && (
                  <div className="cash">
                    <h4>另看資金需求</h4>
                    <p>購車淨支出：{money(r.acquisition_cash)}</p>
                    <p>五年淨現金支出：{money(r.future_net_cash)}</p>
                    <small>
                      含期末售車收入；不等同經濟持有成本。折抵只扣一次，融資僅計利息與費用。
                    </small>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <section className="method">
        <h3>把計算說清楚。</h3>
        <p>
          經濟持有成本 = 起始車輛價值 − 五年後殘值 ＋
          五年燃油、保養、保險、稅費、融資利息與其他支出。
        </p>
        <p>
          保留舊車以目前市值計算未來折舊，歷史購車費用不再計入現金支出。購買車輛以購車價計算折舊；出售舊車只是把既有資產換成現金，不再從經濟成本扣除。
        </p>
        <p>
          低／高情境僅調整燃油與保養費
          ±20%；未預測折舊、通膨、事故或維修風險。這份試算不會直接判定你是否應該換車。
        </p>
      </section>
    </div>
  );
}
