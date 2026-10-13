export type Spec = {
  value: string | number | null;
  unit: string;
  status: "verified" | "estimated" | "missing";
  source_url: string | null;
  retrieved_at: string | null;
  verified_at: string | null;
  market: string;
  note: string;
};
export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  trim: string;
  edition: string;
  body: string;
  specs: Record<string, Spec>;
};
export type Preferences = {
  current_id: string;
  budget: number;
  seats: number;
  annual_km: number;
  usage: string;
  priority: string;
};
export type Match = {
  vehicle: Vehicle;
  score: number;
  eligible: boolean;
  violations: string[];
  explanation: string[];
  tradeoffs: string[];
  components: Record<string, number>;
  estimated_tco: number | null;
};
export type Recommendations = {
  results: Match[];
  has_eligible: boolean;
  weights: Record<string, number>;
  notice: string;
};
export type TCOInput = {
  mode: "buy" | "keep";
  purchase_price: number;
  current_value: number;
  trade_in: number;
  residual_value: number;
  annual_km: number;
  fuel_efficiency: number;
  fuel_price: number;
  annual_insurance: number;
  annual_tax: number;
  annual_maintenance: number;
  financing_cost: number;
  annual_other: number;
};
export type TCOResult = {
  total: number;
  annual: number;
  breakdown: Record<string, number>;
  acquisition_cash: number;
  future_net_cash: number;
  scenarios: { low: number; base: number; high: number };
  assumptions: string;
};
export const money = (n: number) =>
  "NT$ " + Math.round(n).toLocaleString("zh-TW");
export const yearLabel = (v: Vehicle) =>
  v.year ? `${v.year} 年式` : "年式未標示 · 現行型錄";
export async function api<T>(path: string, data?: unknown): Promise<T> {
  const response = await fetch("/api/" + path, {
    method: data ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok)
    throw new Error(
      response.status === 422
        ? "輸入資料不正確，請確認數值範圍、殘值與車款。"
        : "無法連接服務，請確認後端已啟動後重試。",
    );
  return response.json() as Promise<T>;
}
