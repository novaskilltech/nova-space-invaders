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
