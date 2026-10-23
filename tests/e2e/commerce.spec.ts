import { test, expect } from "@playwright/test";

test.describe("commerce flow", () => {
  test("product page allows add to cart even when stock is zero messaging", async ({
    page,
  }) => {
    await page.goto("/produse");
    const firstProduct = page.locator('a[href^="/produse/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page.getByRole("heading").first()).toBeVisible();
    const addButton = page.getByRole("button", { name: /adaugă în coș/i });
    await expect(addButton).toBeVisible();
    await addButton.click();
    await page.goto("/cos");
    await expect(page.getByText(/coș/i).first()).toBeVisible();
  });

  test("checkout page loads", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByText(/ramburs|checkout|comandă/i).first()).toBeVisible();
  });
});

test.describe("admin protection", () => {
  test("admin redirects unauthenticated users", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/cont/);
  });
});
