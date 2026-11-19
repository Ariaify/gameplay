import { test, expect } from '@playwright/test';
import { initialState, STORAGE_KEY } from '../../src/model.js';

const readSaved = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
const go = (page, hash) => page.goto(`./#${hash}`);

test.beforeEach(async ({ page }) => {
  // Fonts are optional; test the bundled app without an external font service.
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
});

test('alle schermen en portretten werken onder een repositorypad', async ({ page }) => {
  const errors = [];
  const failedRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1') && response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Open het profiel van Nova', exact: true })).toBeVisible();
  const portraitURL = await page.locator('.character-card .portrait').first().evaluate(el => getComputedStyle(el).backgroundImage.match(/url\("?([^"\)]+)/)[1]);
  expect((await page.request.get(portraitURL)).status()).toBe(200);
  expect((await page.request.get('favicon.svg')).status()).toBe(200);

  for (const route of ['overzicht', 'spelers', 'spelers/p1', 'missies', 'community', 'ranglijst', 'agents']) {
    await go(page, route);
    await expect(page.locator('main h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await go(page, 'spelers/ontbreekt');
  await expect(page.getByText('Dit personage is niet gevonden', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('spelers zoeken, toevoegen, bewerken en eigen avatar bewaren', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('textbox', { name: 'Zoek speler' }).fill('Atlas');
  await expect(page.locator('.character-card')).toHaveCount(1);
  await page.getByRole('textbox', { name: 'Zoek speler' }).fill('');
  await page.getByRole('button', { name: /Evil · NPC/ }).click();
  await expect(page.locator('.character-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Open het profiel van De Schaduw', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Nieuwe speler', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Naam', { exact: true }).fill('Testspeler');
  await dialog.getByLabel('Rol', { exact: true }).fill('Bouwer');
  await dialog.getByLabel('Persoonlijk doel', { exact: true }).fill('Elke dag iets nieuws leren');
  await dialog.locator('input[name="traits"]').fill('Creatief, Moedig, Creatief');
  await dialog.locator('input[type="file"]').setInputFiles({ name: 'avatar.txt', mimeType: 'text/plain', buffer: Buffer.from('ongeldig') });
  await expect(dialog.getByRole('alert')).toContainText('maximaal 1 MB');
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'avatar.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'),
  });
  await expect(dialog.locator('.portrait-editor-preview img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await dialog.getByRole('button', { name: 'Speler toevoegen', exact: true }).click();
  await expect(page.locator('main h1')).toHaveText('Testspeler');
  await expect(page.locator('.profile-intro .trait-list span')).toHaveCount(2);
  await expect(page.locator('.profile-xp')).toContainText('0');
  await page.getByRole('button', { name: 'Profiel bewerken', exact: true }).click();
  await dialog.getByLabel('Naam', { exact: true }).fill('Nieuwe naam');
  await dialog.getByRole('button', { name: 'Profiel opslaan', exact: true }).click();
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Nieuwe naam');
  const saved = (await readSaved(page)).players.find(p => p.name === 'Nieuwe naam');
  expect(saved.score).toBe(0);
  expect(saved.image).toMatch(/^data:image\/png;base64,/);
  expect(saved.goal).toBe('Elke dag iets nieuws leren');
});

test('missies beoordelen kent eenmaal punten toe en bewaart het logboek', async ({ page }) => {
  await go(page, 'missies');
  await page.getByRole('button', { name: 'Nieuwe missie', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Titel van de missie').fill('Een nieuwe stap');
  await dialog.getByLabel('De opdracht').fill('Help een teamgenoot en reflecteer op de ervaring.');
  await dialog.getByLabel('Voor welke speler?').selectOption('p1');
  await dialog.getByLabel('Pluspunten bij behalen').fill('35');
  await dialog.getByLabel('Minpunten bij niet behalen').fill('7');
  await dialog.getByRole('button', { name: 'Missie toevoegen', exact: true }).click();
  const card = page.locator('.mission-card').filter({ has: page.getByRole('heading', { name: 'Een nieuwe stap', exact: true }) });
  await card.getByRole('button', { name: 'Goedkeuren', exact: true }).click();
  await dialog.getByRole('button', { name: 'Beoordeling opslaan', exact: true }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Jouw toelichting').fill('Goed samengewerkt');
  await dialog.getByRole('button', { name: 'Beoordeling opslaan', exact: true }).click();
  await expect(card.getByRole('button', { name: 'Goedkeuren', exact: true })).toHaveCount(0);
  let saved = await readSaved(page);
  expect(saved.players.find(p => p.id === 'p1').score).toBe(155);
  expect(saved.log).toHaveLength(1);

  const loss = page.locator('.mission-card').filter({ has: page.getByRole('heading', { name: 'Stap buiten je comfortzone', exact: true }) });
  await loss.getByRole('button', { name: 'Niet behaald', exact: true }).click();
  await dialog.getByLabel('Jouw toelichting').fill('Morgen een nieuwe kans');
  await dialog.getByRole('button', { name: 'Beoordeling opslaan', exact: true }).click();
  await page.reload();
  saved = await readSaved(page);
  expect(saved.players.find(p => p.id === 'p1').score).toBe(155);
  expect(saved.players.find(p => p.id === 'p2').score).toBe(80);
  expect(saved.log.map(l => l.delta)).toEqual([35, -5]);
  await page.getByRole('button', { name: /^Voltooid/ }).click();
  await expect(page.locator('.mission-card')).toHaveCount(1);
  await go(page, 'spelers/p1');
  await page.getByRole('button', { name: /^Puntenlogboek/ }).click();
  await expect(page.locator('.log-entry')).toContainText('Goed samengewerkt');
});

test('communitybericht, aanmoediging en export overleven herladen', async ({ page }) => {
  await go(page, 'community');
  const message = 'Een mooie stap <script>alert("test")</script>';
  await page.getByRole('textbox', { name: 'Nieuw communitybericht' }).fill(message);
  await page.getByRole('button', { name: 'Bericht plaatsen', exact: true }).click();
  const post = page.locator('.post').filter({ hasText: message });
  await expect(post).toContainText(message);
  await post.getByRole('button', { name: /Aanmoedigen/ }).click();
  await expect(post.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(post.getByRole('button')).toContainText('1 · Aanmoedigen');
  await post.getByRole('button').click();
  await expect(post.getByRole('button')).toContainText('0 · Aanmoedigen');
  await go(page, 'ranglijst');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporteer gegevens', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('levelup-world-backup.json');
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(JSON.parse(Buffer.concat(chunks).toString()).posts[0].text).toBe(message);
});

test('Escape sluit de dialoog en herstelt toetsenbordfocus', async ({ page }) => {
  await page.goto('./');
  const button = page.getByRole('button', { name: 'Nieuwe speler', exact: true });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(button).toBeFocused();
});

test('gedeeltelijk beschadigde opslag blijft bruikbaar', async ({ page }) => {
  const state = initialState();
  state.players.unshift(null);
  state.players[1].score = 208;
  state.players[1].traits.push(null, { invalid: true });
  state.missions.push({ ...state.missions[0], id: 'orphan', player: 'missing' });
  await page.addInitScript(({ key, state }) => localStorage.setItem(key, JSON.stringify(state)), { key: STORAGE_KEY, state });
  await go(page, 'spelers/p1');
  await expect(page.locator('main h1')).toHaveText('Nova');
  await expect(page.locator('.profile-xp')).toContainText('208');
  await go(page, 'missies');
  await expect(page.locator('.mission-card')).toHaveCount(3);
});

test('opslagfout blijft zichtbaar en export bevat de laatste wijzigingen', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Opslag vol', 'QuotaExceededError'); };
  });
  await go(page, 'community');
  await page.getByRole('textbox', { name: 'Nieuw communitybericht' }).fill('Bewaar deze wijziging');
  await page.getByRole('button', { name: 'Bericht plaatsen', exact: true }).click();
  const alert = page.getByRole('alert');
  await expect(alert).toContainText('Je laatste wijzigingen zijn niet opgeslagen');
  // The warning must outlive the transient success notification.
  await expect(page.getByRole('status')).toBeHidden({ timeout: 7000 });
  await expect(alert).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await alert.getByRole('button', { name: /Exporteer gegevens/ }).click();
  const stream = await (await downloadPromise).createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(JSON.parse(Buffer.concat(chunks).toString()).posts[0].text).toBe('Bewaar deze wijziging');
});
