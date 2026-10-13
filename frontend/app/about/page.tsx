import Link from "next/link";
export default function About() {
  return (
    <article className="wrap page prose">
      <span className="eyebrow">ABOUT THE PROJECT</span>
      <h1>讓選擇更透明。</h1>
      <p className="lead">
        TOYOTA AI DriveMatch 是面向台灣市場的獨立概念專案，非 TOYOTA
        官方應用，也未串接車廠內部系統。
      </p>
      <h2>第一階段：先把比較做好</h2>
      <p>
        從 Honda CR-V 出發，比較 RAV4、COROLLA CROSS 與
        CAMRY，透過需求配對與五年成本試算，理解差異。你也可以選擇保留目前的車。
      </p>
      <h2>資料從哪裡來？</h2>
      <p>
        本機目錄保存 2026-10-13
        人工核對的規格快照。售價、油耗、排氣量與配備取自原廠公開網頁；部分座位數來自外部規格資料，每個比較欄位均可展開來源與日期。TOYOTA
        未確認年式，因此以現行型錄標示。資料不會自動更新。
      </p>
      <ul>
        <li>
          <a
            href="https://www.honda-taiwan.com.tw/2026CR-V/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Honda CR-V 原廠規格 ↗
          </a>
        </li>
        <li>
          <a
            href="https://www.toyota.com.tw/showroom/RAV4/"
            target="_blank"
            rel="noreferrer"
          >
            TOYOTA RAV4 ↗
          </a>
        </li>
        <li>
          <a
            href="https://www.toyota.com.tw/showroom/COROLLA_CROSS/"
            target="_blank"
            rel="noreferrer"
          >
            TOYOTA COROLLA CROSS ↗
          </a>
        </li>
        <li>
          <a
            href="https://www.toyota.com.tw/showroom/CAMRY/"
            target="_blank"
            rel="noreferrer"
          >
            TOYOTA CAMRY ↗
          </a>
        </li>
      </ul>
      <h2>推薦如何計算？</h2>
      <p>
        先檢查預算與座位數，再以價格餘裕、燃油效率與座位適配度計分。預設權重為
        40%、40%、20%；選擇可量化偏好時，該項為 60%，其餘各 20%。分數介於 0 到
        100，不代表購買機率或滿意度。
      </p>
      <p>
        使用情境用來整理需求，尚未套用城市或高速油耗模型。舒適、安全、性能及保養成本缺乏可比較數據時，不捏造分數。無符合車款會明確顯示限制。
      </p>
      <h2>隱私與儲存</h2>
      <p>
        無需姓名、電話或
        VIN。比較選擇只記在目前瀏覽器；需求放在結果頁網址中，分享網址會一併分享這些偏好。沒有行銷資料提交或追蹤分析。
      </p>
      <h2>第二階段：售後服務體驗</h2>
      <p>
        AI 保養夥伴、模擬保養流程、Smart Lounge、可追溯的 RAG 知識庫與選配 LINE
        串接尚未實作，會在第一階段驗證後再建置。
      </p>
      <Link className="button" href="/compare">
        開始探索 →
      </Link>
    </article>
  );
}
