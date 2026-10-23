import { test, expect } from "@playwright/test";

test.describe("public smoke", () => {
  test("homepage opens", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByAltText("LyraBaits").first()).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Produse" }).click();
    await expect(page).toHaveURL(/\/produse/);
  });

  test("mobile menu opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /Deschide meniul/i }).click();
    await expect(page.getByRole("navigation", { name: "Mobil" })).toBeVisible();
  });
});
