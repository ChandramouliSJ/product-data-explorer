﻿import { test, expect } from "@playwright/test";
test("landing loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Product Data Explorer")).toBeVisible();
});
