"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="DriveMatch 首頁">
        <span className="brand-mark">
          D<span>↗</span>
        </span>
        <span>
          DriveMatch<small>TOYOTA AI EXPLORER</small>
        </span>
      </Link>
      <nav aria-label="主要導覽">
        {[
          ["/compare", "車款比較"],
          ["/match", "探索適合車款"],
          ["/tco", "養車成本"],
          ["/about", "關於計畫"],
        ].map(([url, label]) => (
          <Link
            key={url}
            href={url}
            className={pathname === url ? "active" : ""}
            aria-current={pathname === url ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <span className="prototype">
        <i />
        獨立概念專案
      </span>
    </header>
  );
}
