# Van prototype naar een gedeelde spelwereld

De React-app bevat de speelbare lokale basis. De stappen hieronder beschrijven vervolgbouw; ze zijn nog niet geïmplementeerd.

## 1. Accounts en een gedeelde database

- Deelnemers uitnodigen en een account aan hun spelerprofiel koppelen.
- Inloggen en servercontroles voor de rollen Spelleider en speler.
- Spelers, NPC's, missies, communityberichten en beoordelingen gedeeld opslaan.
- Avatars opslaan buiten de browser met bestandsvalidatie en toegangsregels.
- Een gecontroleerde import bouwen voor bestaande lokale gegevens.

De server moet bepalen wie een profiel, missie of bericht mag wijzigen. Alleen de Spelleider beoordeelt missies en wijzigt punten. Een beoordeling wordt samen met de scorewijziging in één transactie opgeslagen. Een unieke beperking per missie voorkomt dubbele beloningen bij gelijktijdige verzoeken.

## 2. Samen spelen

- Spelers laten reageren op hun toegewezen missies met een verslag.
- Een beoordelingswachtrij voor de Spelleider toevoegen.
- Afspreken welke profielvelden, doelen en missies zichtbaar zijn voor andere spelers.
- Communityberichten aan echte auteurs koppelen en meld- en moderatieacties toevoegen.
- Verschillende spelwerelden en seizoenen ondersteunen.

## 3. AI-helpers onder regie van de Spelleider

- Missiemaker: doet voorstellen die aansluiten op een persoonlijk doel.
- Groei-coach: stelt reflectievragen en helpt een volgende stap formuleren.
- Wereldbouwer: bedenkt verhaallijnen en herkenbaar fictieve NPC-uitdagingen.
- Een coördinator kan later opdrachten tussen helpers verdelen.

Begin met voorstellen die de Spelleider kan bewerken en goedkeuren. Een AI-voorstel wijzigt geen score en plaatst geen communitybericht zonder goedkeuring. API-sleutels en AI-aanroepen horen in een serveromgeving. Leg per voorstel de status en de uiteindelijke beslissing vast.

## 4. Klaar voor echte deelnemers

- De uitnodiging, eerste missie en beoordeling met een kleine groep doorlopen.
- Mobiele bediening, toetsenbordbediening en foutmeldingen controleren.
- Gedeelde opslag, toegangsregels, dubbele beoordelingen en herstel na netwerkfouten testen.
- Gegevens exporteren, herstellen en verwijderen ondersteunen.

Het visuele uitgangspunt blijft hetzelfde: de persoon achter het karakter staat centraal, met eigen portret, doel, sterke kanten en aantoonbare voortgang.
