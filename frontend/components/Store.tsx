"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { api, Vehicle } from "@/lib/types";
type State = {
  vehicles: Vehicle[];
  current: string;
  selected: string[];
  setCurrent: (id: string) => void;
  setSelected: (ids: string[]) => void;
  error: string;
  loading: boolean;
  retry: () => void;
};
const Context = createContext<State | null>(null);
export function Store({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]),
    [current, setCurrent] = useState("honda-crv-vtis"),
    [selected, setSelected] = useState([
      "toyota-rav4-luxury",
      "toyota-cross-luxury",
    ]);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const retry = useCallback(() => {
    setLoading(true);
    setError("");
    api<Vehicle[]>("vehicles")
      .then((v) => {
        setVehicles(v);
        try {
          const s = JSON.parse(localStorage.getItem("drivematch.v1") || "null");
          if (s) {
            if (v.some((x) => x.id === s.current)) setCurrent(s.current);
            if (Array.isArray(s.selected))
              setSelected(
                [
                  ...new Set<string>(
                    s.selected.filter(
                      (id: unknown) =>
                        typeof id === "string" &&
                        id !== s.current &&
                        v.some((x) => x.id === id && x.brand === "TOYOTA"),
                    ),
                  ),
                ].slice(0, 3),
              );
          }
        } catch {
          /* Invalid stored state is ignored. */
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    retry();
  }, [retry]);
  useEffect(() => {
    if (vehicles.length)
      try {
        localStorage.setItem(
          "drivematch.v1",
          JSON.stringify({ current, selected }),
        );
      } catch {
        /* Storage is optional. */
      }
  }, [vehicles, current, selected]);
  return (
    <Context.Provider
      value={{
        vehicles,
        current,
        selected,
        setCurrent,
        setSelected,
        error,
        loading,
        retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCatalog() {
  const c = useContext(Context);
  if (!c) throw new Error("Store is required");
  return c;
}
export function CatalogStatus() {
  const { error, loading, retry } = useCatalog();
  return loading ? (
    <p className="status" role="status">
      正在載入車款資料…
    </p>
  ) : error ? (
    <div role="alert" className="notice danger">
      {error} <button onClick={retry}>重新載入</button>
    </div>
  ) : null;
}
