# Decision Log

## 2026-05-07
- Decision : construire une V1 web statique sans bundler
- Raison : workspace vide cote code et besoin de livraison rapide

- Decision : utiliser `canvas`
- Raison : boucle de jeu simple, collisions claires, maintenance faible

- Decision : separer `index.html`, `styles.css`, `game.js`
- Raison : meilleure lisibilite et evolution plus propre

- Decision : ajouter un fallback graphique si les images ne se chargent pas
- Raison : les assets ont une extension `.png` mais une signature JPEG

- Decision : inclure des auto-checks au demarrage
- Raison : fournir une premiere couche RESCUE meme sans framework de test

- Decision : normaliser les sprites critiques en `.jpg`
- Raison : supprimer l'ambiguite creee par des fichiers JPEG renommes en `.png`

- Decision : retirer la police distante
- Raison : eviter une dependance reseau inutile pour le rendu

- Decision : ajouter une invulnerabilite courte apres impact
- Raison : empecher la perte de plusieurs vies sur une seule frame de collision


## 2026-11-01 (V3 - Stitch 3D Biomes, Independent Arsenal & Comm-Link)
- Decision : Integrer les 3 designs Stitch MCP (Campagne, Montagne, Ocean) sous forme de selecteur de Biome 3D temps reel dans le meme moteur
- Raison : Offrir toute la variete visuelle et narrative demandee sans alourdir le chargement ni casser la compatibilite mobile 60 FPS
- Decision : Decoupler totalement le choix du vaisseau et le choix de l'armement (8 armes principales selectionnables au menu + en direct via dock HUD / touches 1-8)
- Raison : Permettre au joueur de personnaliser librement son style de tir quel que soit son vaisseau
- Decision : Ajouter la boite de dialogue tactique interactive (Comm-Link) avec portraits Pilote / Commandant Alien et repliques cliquables
- Raison : Renforcer l'immersion narrative entre les ennemis et le personnage pendant la bataille
