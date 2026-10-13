import { test, expect } from "@playwright/test";

test("customer chooses CR-V, compares three alternatives and inspects sources", async ({
  page,
}) => {
  await page.goto("/");
  const selector = page.getByRole("group", { name: "你目前的車款" });
  await selector.getByLabel("品牌").selectOption("Honda");
  await selector.getByLabel("車款").selectOption("CR-V");
  await selector.getByLabel("年式").selectOption("2026");
  await selector.getByLabel("等級").selectOption("honda-crv-s");
  await page.getByRole("button", { name: "比較 TOYOTA 替代車款" }).click();
  await expect(page).toHaveURL(/\/compare/);
  await expect(
    page.getByRole("heading", { name: "CR-V", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "RAV4", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "新增車款" }).click();
  await expect(
    page.getByRole("heading", { name: "CAMRY", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "新增車款" })).toBeDisabled();
  await page.getByText("已核對來源").first().click();
  await expect(
    page.getByRole("link", { name: "原廠資料" }).first(),
  ).toHaveAttribute("href", /honda-taiwan/);
  await page.getByLabel("只看差異").check();
  await expect(page.getByRole("rowheader", { name: "保固" })).toHaveCount(0);
  await page.getByRole("button", { name: "移除 CAMRY" }).click();
  await expect(
    page.getByRole("heading", { name: "CAMRY", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("group", { name: "選擇比較基準" }).getByLabel("等級"),
  ).toHaveValue("honda-crv-s");
  await page.screenshot({
    path: `../artifacts/compare-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test("wizard exposes seven-seat constraint and lets customer compare alternatives", async ({
  page,
}) => {
  await page.goto("/match");
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByLabel("乘坐人數（含駕駛）").selectOption("7");
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("button", { name: "查看配對結果" }).click();
  await expect(page.getByText("沒有符合所有必要條件的車款。")).toBeVisible();
  await expect(page.getByText("僅 5 人座，不符合 7 人需求")).toHaveCount(3);
  await page.getByRole("button", { name: "一起比較這 3 款車" }).click();
  await expect(
    page.getByRole("heading", { name: "CAMRY", exact: true }),
  ).toBeVisible();
});

test("TCO updates with mileage and refuses impossible residual values", async ({
  page,
}) => {
  await page.goto("/tco");
  await expect(page.getByText("試算已更新", { exact: true })).toBeVisible();
  const card = page.locator(".tco-card").first();
  const initial = await card.locator(".tco-total strong").innerText();
  await page.getByLabel("每年行駛里程（km）").fill("0");
  await expect(card.locator(".tco-total strong")).not.toHaveText(initial);
  await expect(
    card.locator(".breakdown").first().getByText("NT$ 0", { exact: true }),
  ).toHaveCount(3);
  await card.getByLabel("五年後殘值", { exact: true }).fill("99999999");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "輸入資料不正確",
  );
  await expect(card.locator(".tco-total strong")).toHaveText("—");
  await card.getByLabel("五年後殘值", { exact: true }).fill("200000");
  await expect(page.getByText("試算已更新", { exact: true })).toBeVisible();
});

test("home stays within viewport; navigation works without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "比較 TOYOTA 替代車款" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `../artifacts/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "關於計畫" })
    .click();
  await expect(
    page.getByRole("heading", { name: "讓選擇更透明。" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("revising recommendation preferences retains answers", async ({
  page,
}) => {
  await page.goto(
    "/results?current_id=honda-crv-s&budget=900000&seats=4&annual_km=20000&usage=family&priority=price",
  );
  await expect(
    page.getByRole("heading", { name: "COROLLA CROSS", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "調整需求" }).click();
  await expect(page.getByLabel("購車預算上限（TWD）")).toHaveValue("900000");
  await expect(
    page.getByRole("group", { name: "目前車款" }).getByLabel("等級"),
  ).toHaveValue("honda-crv-s");
  await page.getByRole("button", { name: "下一步" }).click();
  await expect(page.getByLabel("乘坐人數（含駕駛）")).toHaveValue("4");
  await expect(page.getByLabel("預估每年行駛里程（km）")).toHaveValue("20000");
});

test("catalog outage shows a recoverable error", async ({ page }) => {
  await page.route("**/api/vehicles", (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page.goto("/compare");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "無法連接服務",
  );
  await page.unroute("**/api/vehicles");
  await page.getByRole("button", { name: "重新載入" }).click();
  await expect(
    page.getByRole("heading", { name: "CR-V", exact: true }),
  ).toBeVisible();
});
