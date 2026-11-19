# LevelUp World · Het gilde

Een Nederlandstalige React-app waarin de Spelleider spelers begeleidt met persoonlijke missies, XP en een sociale community. Het donkere RPG-ontwerp zet de personages centraal: grote portretten, elektrisch violet, nachtblauw en warm goud.

## Starten

Gebruik Node.js 22.12 of hoger. Met nvm kies je de projectversie via `nvm use`.

```sh
npm ci
npm run dev
```

Open de lokale URL die Vite toont. De startpagina is de spelerscollectie. Klik op een personage voor het volledige profiel.

## Testen als spelleider en proefspeler

Start de lokale testomgeving in PowerShell met `npm.cmd run dev:proef` (na `npm.cmd ci`). Onder macOS of Linux gebruik je `npm run dev:proef`. Open het lokale adres dat Vite toont. Vanuit de gewone app opent **Open testomgeving** dezelfde proef via `?test=1`. Voor een afzonderlijke testbuild gebruik je `npm run build:proef`.

1. Kies bovenaan **Proefspeler** om als Rune te spelen. **Breek het ijs** staat klaar. Vul een verslag in en lever het in.
2. Kies **Spelleider**. In het proefprofiel zie je het verslag. Beoordeel de missie en geef een toelichting.
3. Ga terug naar **Proefspeler** voor de feedback en XP. Je kunt in het proefprofiel ook nieuwe missies toewijzen.
4. Optioneel doorloopt Rune de gildeproef, kiest een persoonlijk doel en maakt een eigen missie. Via **Proefspeler opnieuw starten** in het proefprofiel kun je opnieuw beginnen.

De proef start met een kopie van de gildegegevens uit deze browser en voegt één proefspeler toe. Beide weergaven gebruiken samen hun eigen lokale testopslag (`levelup-gilde-proef-v1`). Testvoortgang blijft na herladen beschikbaar. Voor wisselen tussen de rollen is geen account nodig.

## Wat werkt er?

- Speler- en fictieve evil-NPC-profielen toevoegen en bewerken.
- Een portret kiezen of een eigen JPG-, PNG- of WebP-avatar uploaden.
- Persoonlijke doelen, rollen, verhalen en sterke kanten vastleggen.
- Missies toewijzen met plus- en minpunten.
- Missies eenmaal beoordelen met een verplichte toelichting.
- Levels en onderscheidingen afleiden uit scores en behaalde missies.
- De spelersranglijst en het puntenlogboek bekijken.
- Communityberichten plaatsen en aanmoedigen.
- Spelgegevens exporteren als JSON-back-up.

## Controleren en bouwen

```sh
npm run check
```

Dit draait de tests voor spelregels en gegevensherstel en maakt daarna de productiebuild in `dist/`.

De browsertests doorlopen de schermen en spelhandelingen op desktop- en mobiel formaat. Ze controleren ook hosting onder `/gameplay/`, avataruploads, export, toetsenbordfocus en foutmeldingen bij volle browseropslag:

```sh
npx playwright install chromium
npm run test:e2e
```

```sh
npm run preview
```

De workflow in `.github/workflows/ci.yml` voert de spelregeltests, productiebuild en de browsertests uit bij een push of pull request. Deze workflow publiceert de app niet.

## Projectstructuur

| Bestand | Verantwoordelijkheid |
| --- | --- |
| `src/App.jsx` | Pagina's, spelersprofielen, navigatie en formulieren |
| `src/model.js` | Reducer, migratie van browsergegevens en spelregels |
| `src/Icon.jsx` | SVG-iconen |
| `src/style.css` | Responsieve vormgeving en portretpresentatie |
| `public/art/guild-portraits.png` | De vier karakterportretten als atlas |
| `tests/model.test.mjs` | Databehoud, beoordelingen, scores, profielen en levels |
| `tests/browser/app.spec.js` | Desktop- en mobiele tests van de productiebuild |
| `DESIGN.md` | Grafisch concept en herkomst van de portretten |
| `ROADMAP.md` | Volgende stappen voor accounts, gedeelde opslag en AI |

## Gegevens en huidige grenzen

Dit is een browserprototype. De Spelleidermodus is een lokale interface en biedt nog geen beveiligde beheerdersrechten. Spelersprofielen zijn nog geen accounts waarmee deelnemers kunnen inloggen. De community en scores worden nog niet tussen apparaten gedeeld. De AI-pagina toont geplande rollen en verstuurt geen AI-aanvragen.

De app bewaart gegevens in `localStorage` onder `levelup-world-v2`. De bestaande gegevens op dezelfde browser en hetzelfde webadres blijven bruikbaar. Gedeeltelijk beschadigde gegevens worden opgeschoond: geldige profielen, beoordelingen en berichten blijven behouden; ongeldige of dubbele records en missies zonder speler worden overgeslagen. Een ander domein krijgt eigen browseropslag; gegevens verhuizen daar niet automatisch naartoe. Eigen avatars blijven eveneens lokaal. De JSON-export is een back-up; een importfunctie is nog niet aanwezig. Als opslaan mislukt, blijft een waarschuwing met exportknop zichtbaar, zodat je de laatste wijzigingen kunt downloaden voordat je de pagina sluit.

De vier voorbeeldpersonages hebben startpunten. Nieuwe spelers beginnen op 0 XP. Een beoordeling wijzigt de score en schrijft de reden naar het logboek. Een al beoordeelde missie kan niet opnieuw punten opleveren.

## Hosting

Host de inhoud van `dist/` op een statische webserver. De Vite-configuratie gebruikt relatieve assetpaden, zodat dezelfde build ook onder een pad zoals `/gameplay/` kan staan. De navigatie gebruikt URL-hashes en vereist geen serverherschrijvingen. Start de app via een webserver, niet met een `file://`-URL.

React en React DOM worden meegebundeld. De interface gebruikt Google Fonts met lokale lettertype-fallbacks. Er zijn voor deze versie geen API-sleutels nodig.
