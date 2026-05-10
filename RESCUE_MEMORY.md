# Rescue Memory

## 2026-05-07 - Assets images incoherents
- Bug / risque : fichiers avec extension `.png` mais signature interne JPEG
- Cause racine : export ou renommage asset non normalise
- Correction appliquee : ajout d'un fallback de rendu si le navigateur ne charge pas l'image
- Test ajoute : verification manuelle du chargement + auto-check de bootstrap
- Lecon : ne jamais supposer qu'une extension correspond au vrai format binaire

## 2026-05-07 - Workspace sans socle projet
- Bug / risque : aucun code initial, pas de versioning, pas de tests framework
- Cause racine : projet cree avant industrialisation de la structure
- Correction appliquee : creation d'un socle statique minimal documente
- Test ajoute : plan de test dedie et verification de chargement HTTP local
- Lecon : faire un snapshot d'environnement avant toute phase BUILD

## 2026-05-07 - Pertes de vies en cascade
- Bug / risque : plusieurs collisions sur la meme frame pouvaient retirer plusieurs vies
- Cause racine : absence de fenetre d'invulnerabilite apres un impact
- Correction appliquee : invulnerabilite temporaire avec clignotement du joueur
- Test ajoute : revue de logique sur les collisions joueur / tirs / boss / ennemis
- Lecon : toujours proteger les transitions d'etat critiques dans les boucles temps reel

## 2026-05-10 - Transparence des Assets Graphiques
- Bug / risque : Les images d'origine (et générées) possédaient des fonds noirs, masquant le fond d'écran "Hubble" avec des bordures inesthétiques. Le hack d'incrustation Canvas `ctx.globalCompositeOperation = "screen"` n'était pas suffisant pour cacher ces artefacts.
- Correction appliquee : Développement d'un script Python (`remove_bg.py`) pour traiter tous les fichiers PNG/JPG et utiliser leur luminance pour générer une véritable couche alpha, supprimant physiquement les fonds de toutes les images.

## 2026-05-10 - Amélioration de l'Expérience Joueur (Son & Difficulté)
- Ajout : Mise en place d'un sélecteur de difficulté (Facile, Normal, Difficile) impactant directement la vitesse, les dégâts et la fréquence de tir.
- Ajout : Synthèse audio dynamique intégrée via `Web Audio API` (oscillateurs JavaScript) pour les sons de tirs, explosions et power-ups, respectant l'absence de dépendance externe (aucun fichier MP3/WAV supplémentaire).

## 2026-05-10 - Diversification du Gameplay (Powerups et Comportements)
- Ajout : De nouvelles armes et pouvoirs ("Bombe à fragmentation", "Invincibilité", "Clone/Dédoublement laser").
- Bug / risque : La mise en place d'ennemis à déplacement libre ("Free Roaming") a omis la coordonnée `y` lors du drop. Les tirs générés par ces ennemis transmettaient des coordonnées `NaN`, provoquant un crash total de la méthode `ctx.createLinearGradient()`.
- Correction appliquee : Restauration de l'initialisation de `y: startY + row * (height + padding)` pour les nouveaux types d'ennemis.
- Lecon : En modifiant les structures fondamentales d'un objet (ex: la position des ennemis générés), il est crucial de s'assurer de ne supprimer aucune propriété vitale dont dépendent d'autres processus (comme le tir).
