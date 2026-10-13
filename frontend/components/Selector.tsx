"use client";
import { Vehicle } from "@/lib/types";
export default function Selector({
  vehicles,
  value,
  onChange,
  label,
  toyotaOnly = false,
  exclude = [],
}: {
  vehicles: Vehicle[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  toyotaOnly?: boolean;
  exclude?: string[];
}) {
  const list = vehicles.filter(
    (v) =>
      (!toyotaOnly || v.brand === "TOYOTA") &&
      (!exclude.includes(v.id) || v.id === value),
  );
  const car = list.find((v) => v.id === value) || list[0];
  if (!car) return <p>目前沒有其他可選車款。</p>;
  const byBrand = list.filter((v) => v.brand === car.brand),
    byModel = byBrand.filter((v) => v.model === car.model),
    byYear = byModel.filter((v) => v.year === car.year);
  return (
    <fieldset className="selector">
      <legend>{label}</legend>
      <div className="select-grid">
        <label>
          品牌
          <select
            value={car.brand}
            onChange={(e) =>
              onChange(list.find((v) => v.brand === e.target.value)!.id)
            }
          >
            {[...new Set(list.map((v) => v.brand))].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          車款
          <select
            value={car.model}
            onChange={(e) =>
              onChange(byBrand.find((v) => v.model === e.target.value)!.id)
            }
          >
            {[...new Set(byBrand.map((v) => v.model))].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          年式
          <select
            value={car.year ?? "unknown"}
            onChange={(e) =>
              onChange(
                byModel.find(
                  (v) => String(v.year ?? "unknown") === e.target.value,
                )!.id,
              )
            }
          >
            {[...new Set(byModel.map((v) => v.year))].map((y) => (
              <option value={y ?? "unknown"} key={y ?? "unknown"}>
                {y ?? "未標示（現行型錄）"}
              </option>
            ))}
          </select>
        </label>
        <label>
          等級
          <select value={car.id} onChange={(e) => onChange(e.target.value)}>
            {byYear.map((v) => (
              <option value={v.id} key={v.id}>
                {v.trim}
              </option>
            ))}
          </select>
        </label>
      </div>
    </fieldset>
  );
}
