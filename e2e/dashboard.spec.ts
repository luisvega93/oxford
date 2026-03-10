import { expect, test } from '@playwright/test'

test('loads the dashboard and allows switching alternatives', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /business alternatives dashboard/i }),
  ).toBeVisible()
  await expect(page.getByText(/selected model/i)).toBeVisible()

  await page.getByRole('button', { name: 'Alternative 4' }).click()

  await expect(
    page.getByRole('heading', {
      name: 'Developer + Fractionals + Operations',
      level: 3,
    }),
  ).toBeVisible()
  await expect(
    page.getByText(/selected model/i),
  ).toBeVisible()
  await expect(page.getByText(/Fast payback from development paired with recurring operations/i)).toBeVisible()
})
