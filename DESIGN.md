# LevelUp World — The Guild

## Visuele richting
Een hedendaags sociaal RPG, met de sfeer van een karakterselectiescherm. De spelers zijn het visuele middelpunt. Nachtblauwe oppervlakken, elektrisch violet, oudgouden accenten en cinematografische portretten. Rustige panelen en scherpe typografie houden het bruikbaar voor dagelijkse coaching.

## Spelers eerst
- Grote portretten met een eigen kleur en symbool per archetype: Zonwachter, Verkenner, Hoeder en Schaduw.
- Eén duidelijke primaire actie per kaart: open het volledige profiel.
- Een profiel toont rol, eigen doel, sterke kanten, XP, actieve missies en beoordelingsgeschiedenis.
- Profielen zijn bewerkbaar; eigen avataruploads en portretkeuze zijn beschikbaar.
- Voortgang en onderscheidingen komen uit echte missiegegevens; geen verzonnen vaardigheidsscores.
- Fictieve evil-NPC’s blijven herkenbaar als NPC.

## React
Componenten voor navigatie, kaarten, profielen, formulieren en missies. Eén centrale reducer voor spelacties. Bestaande browsergegevens blijven onder dezelfde opslagsleutel beschikbaar. React rendert tekst veilig en Vite levert een zelfstandig productiegebouw.

## Interactie
Toetsenbordbedienbare kaarten, dialogen met focusherstel, mobiele navigatie, leesbaar contrast en ondersteuning voor minder beweging. Bestaande missie-, punten-, feed- en exportfuncties blijven aanwezig.

## Portretasset

Bestand: `public/art/guild-portraits.png`. Gegenereerd met de ingebouwde beeldgenerator en ongewijzigd in het project opgenomen. De bron blijft behouden. Een enkele 2×2-atlas geeft alle portretten dezelfde grafische stijl. De kwadranten worden met CSS afzonderlijk getoond.

Gebruikte prompt:

> Use case: stylized-concept. Asset type: ONE cohesive 2 by 2 character portrait atlas for a premium social RPG web app called LevelUp World. Make a square image with EXACTLY FOUR equally sized square quadrants, no gutters, no text, no labels, no frames. Each quadrant is a separate cinematic waist-up character portrait centered with head at upper center; all share an exquisitely art-directed painterly 3D graphic novel aesthetic, angular shapes, sophisticated expressive faces, realistic fabric, rich color and atmospheric rim light. Top left: NOVA, warm and confident young adult woman, short copper hair, ochre gold modern adventurer jacket, bronze sun pendant, golden sunset and dusty canyon backdrop. Top right: ATLAS, calm young adult man with medium brown skin, swept dark hair, layered teal explorer jacket, compact navigation gear, misty blue mountains and cyan rim light. Bottom left: ECHO, thoughtful young adult woman with deep brown skin, curly dark hair tied up, forest green and ivory druid-inspired contemporary clothing, warm bioluminescent woodland and jade light. Bottom right: THE SHADOW, clearly fictional mysterious hooded faceless NPC with a black angular mask and very subtle violet eyes, layered dark violet cloak, drifting violet mist, elegant silhouette. Mood: inviting adventure, personal growth, rich character identity, premium game key art, not cute or childish, not horror. Style: painterly sculptural digital concept art with brush texture, strong graphic silhouettes, dramatic chiaroscuro, exceptionally polished. All four faces at the same relative size and position within their own quadrant; important hair and shoulders comfortably inside each quadrant. Fill each quadrant to its edge, no border and no watermark. No typography anywhere. The result must be a single square 2x2 atlas usable as CSS background sprites.
