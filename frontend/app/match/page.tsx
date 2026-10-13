"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalog, CatalogStatus } from "@/components/Store";
import Selector from "@/components/Selector";
import { Preferences } from "@/lib/types";
export default function Match() {
  const { vehicles, current, setCurrent } = useCatalog();
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [p, setP] = useState<Preferences>({
    current_id: current,
    budget: 1200000,
    seats: 5,
    annual_km: 15000,
    usage: "mixed",
    priority: "fuel",
  });
  useEffect(() => {
    if (!vehicles.length) return;
    const q = new URLSearchParams(window.location.search);
    if (!q.size) return;
    setP((old) => ({
      ...old,
      budget: Number(q.get("budget") ?? old.budget),
      seats: Number(q.get("seats") ?? old.seats),
      annual_km: Number(q.get("annual_km") ?? old.annual_km),
      usage: q.get("usage") || old.usage,
      priority: q.get("priority") || old.priority,
    }));
    const id = q.get("current_id");
    if (id && vehicles.some((v) => v.id === id)) setCurrent(id);
  }, [vehicles, setCurrent]);
  const change = (k: keyof Preferences, v: string | number) =>
    setP({ ...p, [k]: v });
  return (
    <div className="wrap page wizard-layout">
      <aside>
        <span className="eyebrow">FIND YOUR FIT</span>
        <h1>
          讓生活，
          <br />
          決定方向。
        </h1>
        <p className="lead">
          三個步驟，整理你的需求。
          <br />
          每一個配對，都有清楚的理由。
        </p>
        <ol className="steps">
          {["從你現在的車出發", "想想每天的生活", "決定你在意的事"].map(
            (s, i) => (
              <li key={s} className={step === i ? "active" : ""}>
                <span>{i < step ? "✓" : `0${i + 1}`}</span>
                {s}
              </li>
            ),
          )}
        </ol>
        <small>配對採用透明規則計算，無需提供個人資料。</small>
      </aside>
      <section className="panel wizard">
        <span className="eyebrow">STEP 0{step + 1} / 03</span>
        <CatalogStatus />
        {vehicles.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) setStep(step + 1);
              else
                router.push(
                  "/results?" +
                    new URLSearchParams(
                      Object.entries({ ...p, current_id: current }).map(
                        ([k, v]) => [k, String(v)],
                      ),
                    ).toString(),
                );
            }}
          >
            {step === 0 && (
              <>
                <h2>目前開什麼車？</h2>
                <p className="muted">把熟悉的車，當作探索的起點。</p>
                <Selector
                  vehicles={vehicles}
                  value={current}
                  onChange={setCurrent}
                  label="目前車款"
                />
                <label className="field">
                  購車預算上限（TWD）
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    required
                    value={Number.isFinite(p.budget) ? p.budget : ""}
                    onChange={(e) => change("budget", e.target.valueAsNumber)}
                  />
                  <small>預算與座位數是必要條件；不符合時會清楚標示。</small>
                </label>
              </>
            )}
            {step === 1 && (
              <>
                <h2>你的日常，是什麼樣子？</h2>
                <label className="field">
                  主要使用情境
                  <select
                    value={p.usage}
                    onChange={(e) => change("usage", e.target.value)}
                  >
                    {[
                      ["urban", "市區通勤"],
                      ["highway", "高速公路通勤"],
                      ["family", "家庭接送"],
                      ["long", "長途旅行"],
                      ["mixed", "混合使用"],
                    ].map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  乘坐人數（含駕駛）
                  <select
                    value={p.seats}
                    onChange={(e) => change("seats", Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={n}>
                        {n} 人
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  預估每年行駛里程（km）
                  <input
                    required
                    type="number"
                    min="0"
                    max="200000"
                    step="500"
                    value={Number.isFinite(p.annual_km) ? p.annual_km : ""}
                    onChange={(e) =>
                      change("annual_km", e.target.valueAsNumber)
                    }
                  />
                </label>
              </>
            )}
            {step === 2 && (
              <>
                <h2>你最在意什麼？</h2>
                <fieldset className="priorities">
                  <legend className="sr-only">主要偏好</legend>
                  {[
                    ["fuel", "燃油效率", "每一段路，都精打細算"],
                    ["price", "購車價格", "保留生活的預算"],
                    ["space", "乘坐空間", "先滿足同行的人數"],
                    ["maintenance", "低保養成本", "需要額外資料確認"],
                    ["safety", "安全", "配備之外，也需要實測"],
                    ["comfort", "舒適度", "留待實際試乘體驗"],
                    ["performance", "性能", "需要完整動力資料"],
                  ].map(([v, l, d]) => (
                    <label
                      className={
                        p.priority === v ? "priority selected" : "priority"
                      }
                      key={v}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={v}
                        checked={p.priority === v}
                        onChange={() => change("priority", v)}
                      />
                      <span>
                        <strong>{l}</strong>
                        <small>{d}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
                <p className="muted">
                  目前可量化價格、油耗與座位數。其他偏好會保留並揭露資料限制，不捏造主觀分數。
                </p>
              </>
            )}
            <div className="wizard-actions">
              {step > 0 ? (
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  ← 上一步
                </button>
              ) : (
                <span />
              )}
              <button className="button" type="submit">
                {step < 2 ? "下一步 →" : "查看配對結果 ↗"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
