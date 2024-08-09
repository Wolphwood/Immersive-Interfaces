# Disclaimer
**N'étant pas un pixel artist accomplie, je me base principalement sur l'existant fait par [Shrimpsnail](https://github.com/Shrimpsnail/Immersive-Interfaces)**

# Todo
- [x] Faire un meilleur script pour générer les fichiers de langue.
- [ ] Faire le cadre des effets de potions (style parchemin)
- [ ] Convertir l'aide à la visualisation en tant que "pack patch" (plus léger, plus simple)
 - [ ] Fournir les templates des aides à la visée **au cas où**
- [x] Faire cuire des oeufs.

# Script
_Doc plus complète à venir_

## Fonctionnement _(résumé)_
- Importe le fichier de langue "model"
- Récupère la liste sous forme de Map de touts les fichiers de __".minecraft/assets/objects/"__ `hash → full_path_to_file`
- Lis l'index le plus récent dans ".minecraft/assets/indexes/" et map sont contenu. `filename.ext → { hash: "...", size: 0 }`
- Process la liste de langue
 - `key: "text"` : copie colle le texte dans le fichier de sortie.
 - `key: { text: "..." }` copie colle le texte dans le fichier de sortie.
 - `key: { prefix: "..." }` Ajoute un prefix au texte original puis le colle dans le fichier de sortie.
 - `key: { suffix: "..." }` Ajoute un suffix au texte original puis le colle dans le fichier de sortie.
 **Attention, 'text', 'prefix' et 'suffix' ne sont pas cumulable**
- Export le fichier de langue généré dans __"<PathToRessourcePack>/assets/minecraft/lang/<lang>.json"__

Script trouvable [[ici]](./scripts/lang.js)
Model de langue [[ici]](./scripts/lang.json)

# Créatif

## Inventaire Créatif

![Tab Inventory](./screenshots/creative_inventory__tab_inventory.png)

## Onglets
![Tab 0](./screenshots/creative_inventory__tab_0.png)
![Tab 1](./screenshots/creative_inventory__tab_1.png)
![Tab 2](./screenshots/creative_inventory__tab_2.png)

## Recherche
![Tab Search](./screenshots/creative_inventory__tab_search.png)


# Container

## Adding some help to see slots (optionnal)
![Barrel](./screenshots/container_slots/1.png)
![Double Chest](./screenshots/container_slots/2.png)
![Ender Chest](./screenshots/container_slots/3.png)
![Chest Minecart](./screenshots/container_slots/4.png)
![Chest](./screenshots/container_slots/5.png)