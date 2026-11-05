# LevelUp World · Het gilde

Een Nederlandstalige React-app waarin de Spelleider spelers begeleidt met persoonlijke missies, XP en een sociale community. Het donkere RPG-ontwerp zet de personages centraal: grote portretten, elektrisch violet, nachtblauw en warm goud.

## Starten

Gebruik Node.js 22.12 of hoger. Met nvm kies je de projectversie via `nvm use`.

```sh
npm ci
npm run dev
```

Open de lokale URL die Vite toont. De startpagina is de spelerscollectie. Klik op een personage voor het volledige profiel.

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

Dit draait de tests en maakt daarna de productiebuild in `dist/`.

```sh
npm run preview
```

De workflow in `.github/workflows/ci.yml` voert dezelfde controles uit bij een push of pull request. Deze workflow publiceert de app niet.

## Projectstructuur

| Bestand | Verantwoordelijkheid |
| --- | --- |
| `src/App.jsx` | Pagina's, spelersprofielen, navigatie en formulieren |
| `src/model.js` | Reducer, migratie van browsergegevens en spelregels |
| `src/Icon.jsx` | SVG-iconen |
| `src/style.css` | Responsieve vormgeving en portretpresentatie |
| `public/art/guild-portraits.png` | De vier karakterportretten als atlas |
| `tests/model.test.mjs` | Databehoud, beoordelingen, scores, profielen en levels |
| `DESIGN.md` | Grafisch concept en herkomst van de portretten |
| `ROADMAP.md` | Volgende stappen voor accounts, gedeelde opslag en AI |

## Gegevens en huidige grenzen

Dit is een browserprototype. De Spelleidermodus is een lokale interface en biedt nog geen beveiligde beheerdersrechten. Spelersprofielen zijn nog geen accounts waarmee deelnemers kunnen inloggen. De community en scores worden nog niet tussen apparaten gedeeld. De AI-pagina toont geplande rollen en verstuurt geen AI-aanvragen.

De app bewaart gegevens in `localStorage` onder `levelup-world-v2`. De bestaande gegevens op dezelfde browser en hetzelfde webadres blijven bruikbaar. Een ander domein krijgt eigen browseropslag; gegevens verhuizen daar niet automatisch naartoe. Eigen avatars blijven eveneens lokaal. De JSON-export is een back-up; een importfunctie is nog niet aanwezig.

De vier voorbeeldpersonages hebben startpunten. Nieuwe spelers beginnen op 0 XP. Een beoordeling wijzigt de score en schrijft de reden naar het logboek. Een al beoordeelde missie kan niet opnieuw punten opleveren.

## Hosting

Host de inhoud van `dist/` op een statische webserver. De Vite-configuratie gebruikt relatieve assetpaden, zodat dezelfde build ook onder een pad zoals `/gameplay/` kan staan. De navigatie gebruikt URL-hashes en vereist geen serverherschrijvingen. Start de app via een webserver, niet met een `file://`-URL.

React en React DOM worden meegebundeld. De interface gebruikt Google Fonts met lokale lettertype-fallbacks. Er zijn voor deze versie geen API-sleutels nodig.
