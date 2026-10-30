import { test, expect } from "@playwright/test";

test("generates an invoice PDF with an uploaded logo", async ({ page }) => {
  await page.goto("/invoice");
  const logo = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
  await page.locator('aside input[type="file"]').setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: logo });
  await expect(page.getByAltText("Your uploaded logo preview")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download invoice PDF/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  expect((await download.createReadStream())?.readable).toBe(true);
});

test("renders the landing page and proposal tool on mobile without page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(`${request.url()} ${request.failure()?.errorText ?? "failed"}`));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Look professional. Get paid faster." })).toBeVisible();
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
  await page.goto("/proposal");
  await expect(page.getByRole("heading", { name: "Turn a rough brief into a confident proposal." })).toBeVisible();
  await expect(page.getByLabel("Client name")).toHaveValue("Priya Sharma");
  expect(errors).toEqual([]);
});
