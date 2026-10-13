"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  api,
  Preferences,
  Recommendations,
  money,
  yearLabel,
} from "@/lib/types";
import { useCatalog } from "@/components/Store";
import VehicleArt from "@/components/VehicleArt";
export default function Results() {
  const [data, setData] = useState<Recommendations | null>(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const { setSelected, setCurrent } = useCatalog();
  const router = useRouter();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p: Preferences = {
      current_id: q.get("current_id") || "honda-crv-vtis",
      budget: Number(q.get("budget") || 1200000),
      seats: Number(q.get("seats") || 5),
      annual_km: Number(q.get("annual_km") || 15000),
      usage: q.get("usage") || "mixed",
      priority: q.get("priority") || "fuel",
    };
    setPrefs(p);
    let active = true;
    setError("");
    api<Recommendations>("recommendations", p)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR POSSIBILITIES</span>
          <h1>
            {data?.has_eligible
              ? "適合你的，值得多了解。"
              : "探索你的配對結果。"}
          </h1>
          <p className="muted">價格、燃油效率與座位需求，讓每一分都有依據。</p>
        </div>
        <Link
          className="button secondary"
          href={
            prefs
              ? `/match?${new URLSearchParams(Object.entries(prefs).map(([k, v]) => [k, String(v)]))}`
              : "/match"
          }
        >
          調整需求 ↗
        </Link>
      </div>
      {error ? (
        <div className="notice danger" role="alert">
          {error}
          <button onClick={() => setAttempt(attempt + 1)}>重試</button>
        </div>
      ) : !data ? (
        <p role="status">正在計算配對…</p>
      ) : (
        <>
          <div className="notice">
            {data.notice}
            <br />
            權重：價格 {Math.round(data.weights.price * 100)}% · 油耗{" "}
            {Math.round(data.weights.fuel * 100)}% · 座位{" "}
            {Math.round(data.weights.space * 100)}%
          </div>
          {!data.has_eligible && (
            <div className="notice danger" role="status">
              <strong>沒有符合所有必要條件的車款。</strong>
              以下僅列接近選項，均不是有效配對；請調整預算或人數。
            </div>
          )}
          <div className="result-grid">
            {data.results.map((r, i) => (
              <article className="panel result-card" key={r.vehicle.id}>
                <div className="column-top">
                  <span className="eyebrow">
                    0{i + 1} / {r.eligible ? "符合必要條件" : "未符合條件"}
                  </span>
                  <span className="score">
                    {r.score}
                    <small> / 100</small>
                  </span>
                </div>
                <VehicleArt
                  sedan={r.vehicle.body === "轎車"}
                  color={["#8b9f94", "#a4adb3", "#a4a6b9"][i]}
                />
                <span className="eyebrow">{r.vehicle.brand}</span>
                <h2>{r.vehicle.model}</h2>
                <p className="trim-label">
                  {yearLabel(r.vehicle)} · {r.vehicle.trim}
                </p>
                <strong className="price">
                  {money(Number(r.vehicle.specs.price.value))}
                </strong>
                {r.violations.map((s) => (
                  <p className="error-text" key={s}>
                    {s}
                  </p>
                ))}
                <h4>為什麼列入比較</h4>
                {r.explanation.map((s) => (
                  <p key={s}>{s}</p>
                ))}
                <h4>也需要考慮</h4>
                {r.tradeoffs.map((s) => (
                  <p key={s}>{s}</p>
                ))}
                <div className="estimate">
                  <small>五年持有成本 · 示例假設</small>
                  <strong>
                    {r.estimated_tco === null
                      ? "資料不足"
                      : money(r.estimated_tco)}
                  </strong>
                  <small>
                    殘值 40%；油價 32 元/L；年保險 2 萬、稅費與保養各 1.5
                    萬。可在成本頁調整。
                  </small>
                </div>
                <button
                  className="button secondary"
                  onClick={() => {
                    setCurrent(prefs?.current_id || "honda-crv-vtis");
                    setSelected(
                      [r.vehicle.id].filter((id) => id !== prefs?.current_id),
                    );
                    router.push("/compare");
                  }}
                >
                  與目前車款比較 ↗
                </button>
              </article>
            ))}
          </div>
          {data.results.length > 0 && (
            <div className="center">
              <button
                className="button"
                onClick={() => {
                  setCurrent(prefs?.current_id || "honda-crv-vtis");
                  setSelected(
                    data.results
                      .map((r) => r.vehicle.id)
                      .filter((id) => id !== prefs?.current_id),
                  );
                  router.push("/compare");
                }}
              >
                一起比較這 {data.results.length} 款車 →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
