"use client";
import { useState } from "react";
import Link from "next/link";
import { useCatalog, CatalogStatus } from "@/components/Store";
import Selector from "@/components/Selector";
import VehicleArt from "@/components/VehicleArt";
import { Spec, money, yearLabel } from "@/lib/types";
const categories = ["全部規格", "價格與動力", "空間與尺寸", "安全與配備"];
const rows = [
  ["price", "建議售價", "價格與動力"],
  ["powertrain", "動力系統", "價格與動力"],
  ["displacement", "排氣量", "價格與動力"],
  ["fuel", "原廠測試油耗", "價格與動力"],
  ["seats", "乘坐人數", "空間與尺寸"],
  ["dimensions", "長 × 寬 × 高", "空間與尺寸"],
  ["cargo", "行李廂容積", "空間與尺寸"],
  ["safety", "駕駛輔助系統", "安全與配備"],
  ["infotainment", "多媒體螢幕", "安全與配備"],
  ["warranty", "保固", "安全與配備"],
];
function SpecCell({ spec, price }: { spec: Spec; price: boolean }) {
  return (
    <>
      <span className={spec.value === null ? "muted" : "spec-value"}>
        {spec.value === null
          ? "待確認"
          : price
            ? money(Number(spec.value))
            : `${spec.value} ${spec.unit}`}
      </span>
      {spec.source_url && (
        <details className="source">
          <summary>
            {spec.status === "verified" ? "已核對來源" : "估算值"} ↗
          </summary>
          <a href={spec.source_url} target="_blank" rel="noreferrer">
            {spec.source_url.includes("toyota.com.tw") ||
            spec.source_url.includes("honda-taiwan.com.tw")
              ? "原廠資料"
              : "外部規格資料"}{" "}
            ↗
          </a>
          <p>
            核對：{spec.verified_at}
            <br />
            市場：{spec.market}
            <br />
            {spec.note}
          </p>
        </details>
      )}
    </>
  );
}
export default function Compare() {
  const { vehicles, current, selected, setCurrent, setSelected } = useCatalog();
  const [category, setCategory] = useState("全部規格"),
    [different, setDifferent] = useState(false),
    [notice, setNotice] = useState("");
  const baseline = vehicles.find((v) => v.id === current);
  const cars = [
    baseline,
    ...selected.map((id) => vehicles.find((v) => v.id === id)),
  ].filter((v) => v !== undefined);
  const available = vehicles.filter(
    (v) => v.brand === "TOYOTA" && !selected.includes(v.id) && v.id !== current,
  );
  return (
    <div className="wrap page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SIDE BY SIDE</span>
          <h1>比較差異，找到適合。</h1>
          <p className="muted">
            從你的車出發，最多加入三款 TOYOTA。不同年式與等級分別標示。
          </p>
        </div>
        <Link className="button secondary" href="/tco">
          比較五年成本 ↗
        </Link>
      </div>
      <CatalogStatus />
      {baseline && (
        <>
          <div className="compare-toolbar">
            <div className="tabs" aria-label="比較分類">
              {categories.map((c) => (
                <button
                  className={category === c ? "chosen" : ""}
                  aria-pressed={category === c}
                  key={c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={different}
                onChange={(e) => setDifferent(e.target.checked)}
              />
              只看差異
            </label>
          </div>
          <p className="scroll-hint">
            畫面較窄時，可左右滑動比較表查看其他車款 →
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            aria-label="車款比較表，可水平捲動"
          >
            <table className="compare-table">
              <caption className="sr-only">
                目前車款與 TOYOTA 替代車款規格比較
              </caption>
              <thead>
                <tr>
                  <th className="row-label">
                    <span className="eyebrow">YOUR COMPARISON</span>
                    <h3>
                      每個選擇，
                      <br />
                      都有理由。
                    </h3>
                    <p className="muted">{selected.length} / 3 款替代車款</p>
                    <button
                      className="button secondary small"
                      disabled={selected.length >= 3 || !available.length}
                      onClick={() => {
                        setSelected([...selected, available[0].id]);
                        setNotice("已新增比較車款");
                      }}
                    >
                      ＋ 新增車款
                    </button>
                  </th>
                  {cars.map((car, i) => (
                    <th
                      key={`${i}-${car.id}`}
                      className={i === 0 ? "baseline" : ""}
                    >
                      <div className="column-top">
                        <span className={i === 0 ? "pill" : "pill green"}>
                          {i === 0 ? "你的比較基準" : "TOYOTA 替代車款"}
                        </span>
                        {i > 0 && (
                          <button
                            className="remove"
                            aria-label={`移除 ${car.model}`}
                            onClick={() => {
                              setSelected(
                                selected.filter((id) => id !== car.id),
                              );
                              setNotice(`已移除 ${car.model}`);
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <VehicleArt
                        sedan={car.body === "轎車"}
                        color={["#8a979f", "#9ca9a1", "#b3adb2", "#90a3b1"][i]}
                      />
                      <span className="eyebrow">{car.brand}</span>
                      <h2>{car.model}</h2>
                      <p className="trim-label">
                        {yearLabel(car)} · {car.trim}
                      </p>
                      <Selector
                        vehicles={vehicles}
                        value={car.id}
                        label={i === 0 ? "選擇比較基準" : `選擇替代車款 ${i}`}
                        toyotaOnly={i > 0}
                        exclude={
                          i > 0
                            ? [
                                ...selected.filter((id) => id !== car.id),
                                current,
                              ]
                            : []
                        }
                        onChange={(id) => {
                          if (i === 0) {
                            setCurrent(id);
                            setSelected(selected.filter((s) => s !== id));
                          } else
                            setSelected(
                              selected.map((s) => (s === car.id ? id : s)),
                            );
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter(
                    ([, , cat]) => category === "全部規格" || cat === category,
                  )
                  .filter(
                    ([key]) =>
                      !different ||
                      new Set(cars.map((c) => c.specs[key].value)).size > 1,
                  )
                  .map(([key, label]) => {
                    const diff =
                      new Set(cars.map((c) => c.specs[key].value)).size > 1;
                    return (
                      <tr key={key} className={diff ? "difference" : ""}>
                        <th scope="row">
                          {label}
                          {diff && (
                            <span className="diff-dot" title="此項有差異" />
                          )}
                        </th>
                        {cars.map((car, i) => (
                          <td key={`${i}-${car.id}`}>
                            <SpecCell
                              spec={car.specs[key]}
                              price={key === "price"}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="compare-bottom">
            <span role="status">{notice || "比較選擇會儲存在此瀏覽器。"}</span>
            <span>
              <i className="diff-dot" />
              有差異的項目　·　所有車型插畫僅為示意
            </span>
          </div>
          <div className="notice">
            資料快照：2026-10-13。未標示年式的 TOYOTA 為現行型錄，不能視為與
            CR-V
            相同年式。原廠測試油耗不等於實際道路油耗；缺少的資料保留為「待確認」。
          </div>
        </>
      )}
    </div>
  );
}
