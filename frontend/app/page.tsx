"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCatalog, CatalogStatus } from "@/components/Store";
import Selector from "@/components/Selector";
export default function Home() {
  const { vehicles, current, setCurrent, setSelected } = useCatalog();
  const router = useRouter();
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="red-dot" /> A BETTER DRIVE STARTS WITH YOU
          </span>
          <h1>
            下一段旅程，
            <br />從<span>了解自己</span>開始。
          </h1>
          <p className="lead">
            從你現在的車出發。把規格、生活需求與養車成本放在一起，找到適合你的下一步。
          </p>
          <div className="actions">
            <Link className="button" href="#start">
              開始比較車款 <span>↗</span>
            </Link>
            <Link className="text-link" href="/match">
              還沒想法？讓我們陪你找 →
            </Link>
          </div>
          <div className="hero-notes">
            <span>01　看見真實差異</span>
            <span>02　理解長期成本</span>
            <span>03　保留你的選擇</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-top">
            <span>TOYOTA bZ4X</span>
            <span>↗</span>
          </div>
          <div className="road">
            <div />
            <div />
            <div />
          </div>
          <div className="hero-car">
            <Image
              src="/images/toyota-bz4x.png"
              alt="TOYOTA bZ4X 銀色純電休旅車側面原廠展示圖"
              width={540}
              height={187}
              loading="eager"
              unoptimized
            />
          </div>
          <div className="visual-caption">
            <span>
              不只比較車。
              <br />
              <strong>也比較生活的可能。</strong>
            </span>
            <span className="visual-index">PURE ELECTRIC</span>
          </div>
          <a
            className="art-note"
            href="https://www.toyota.com.tw/showroom/bZ4X/"
            target="_blank"
            rel="noreferrer"
          >
            bZ4X 展示車圖 · 圖片來源：TOYOTA 台灣 ↗
          </a>
        </div>
      </section>
      <section className="start-section wrap" id="start">
        <div>
          <span className="eyebrow">START WITH YOUR CAR</span>
          <h2>先從你熟悉的車開始。</h2>
          <p className="muted">選擇目前車款，與 TOYOTA 替代車款並排探索。</p>
        </div>
        <div className="start-form">
          <CatalogStatus />
          {vehicles.length > 0 && (
            <>
              <Selector
                vehicles={vehicles}
                value={current}
                onChange={setCurrent}
                label="你目前的車款"
              />
              <button
                className="button"
                onClick={() => {
                  setSelected(
                    ["toyota-rav4-luxury", "toyota-cross-luxury"].filter(
                      (id) => id !== current,
                    ),
                  );
                  router.push("/compare");
                }}
              >
                比較 TOYOTA 替代車款 →
              </button>
              <small>
                已收錄 Honda CR-V 與三款 TOYOTA；更多車款持續整理中。
              </small>
            </>
          )}
        </div>
      </section>
      <section className="wrap tools-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAKE AN INFORMED CHOICE</span>
            <h2>每個問題，都值得好好比較。</h2>
          </div>
          <span className="muted">由需求出發，不急著做決定。</span>
        </div>
        <div className="tool-grid">
          {[
            {
              n: "01",
              icon: "⇄",
              title: "把差異，看清楚",
              text: "現有車款加上最多三款 TOYOTA，規格與來源一目瞭然。",
              url: "/compare",
              cta: "前往車款比較",
            },
            {
              n: "02",
              icon: "⌖",
              title: "找到生活的契合",
              text: "你的預算、乘坐需求與偏好，轉化成可解釋的車款配對。",
              url: "/match",
              cta: "探索適合車款",
            },
            {
              n: "03",
              icon: "↗",
              title: "算得更長遠一點",
              text: "從燃油到折舊，把未來五年的持有成本攤開來看。",
              url: "/tco",
              cta: "試算養車成本",
            },
          ].map((x) => (
            <Link className="tool-card" key={x.n} href={x.url}>
              <div className="tool-top">
                <span>{x.icon}</span>
                <small>{x.n}</small>
              </div>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <strong>
                {x.cta} <span>↗</span>
              </strong>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap closing">
        <span className="eyebrow">YOUR CAR. YOUR PACE.</span>
        <h2>
          繼續開現在的車，
          <br />
          也可以是很好的選擇。
        </h2>
        <p>
          我們提供比較的依據，決定權始終在你。
          <br />
          AI 保養夥伴與智慧休息區，將於第二階段探索。
        </p>
        <Link className="text-link" href="/about">
          了解這個計畫 →
        </Link>
      </section>
    </>
  );
}
