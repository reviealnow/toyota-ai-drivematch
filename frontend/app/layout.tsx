import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "@/components/Store";
import Nav from "@/components/Nav";
import "./globals.css";
export const metadata: Metadata = {
  title: "DriveMatch｜找到下一段旅程的可能",
  description:
    "比較 Honda CR-V 與 TOYOTA 車款，探索適合車款，透明試算五年養車成本。台灣市場獨立概念專案。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip">
          跳至主要內容
        </a>
        <Store>
          <Nav />
          <main id="main">{children}</main>
          <footer>
            <div className="brand">
              DriveMatch<span className="muted">讓每個選擇，都有依據。</span>
            </div>
            <p>
              台灣市場獨立原型 · 非 TOYOTA 官方服務
              <br />
              規格依來源與等級為準；成本為可調整的情境試算。
            </p>
            <Link href="/about">資料與方法 ↗</Link>
          </footer>
        </Store>
      </body>
    </html>
  );
}
