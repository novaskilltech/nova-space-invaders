# Spec Snapshot - Nova Space Invaders V1

## Objectif
Livrer un prototype web jouable, fiable et maintenable de type Space Invaders.

## Portee V1
- Jeu solo desktop navigateur
- Deplacement horizontal du joueur
- Tir joueur
- Vagues d'ennemis progressives
- Boss simple toutes les 3 vagues
- Score, vies, pause, game over, restart
- Integration des assets locaux existants avec fallback graphique si chargement impossible

## Hors perimetre V1
- Audio
- Sauvegarde persistante
- Ecran tactile
- Menu multi-niveaux
- Backend

## Definition of Ready
- Theme du jeu connu : Space Invaders
- Plateforme cible connue : navigateur web
- Assets minimum presents
- MVP deduit et coherent avec le nom du projet

Statut DoR : OK par hypothese raisonnable en absence de CDC detaille.

## Criteres d'acceptation
- La page s'ouvre sans erreur bloquante
- Une partie peut etre lancee depuis l'overlay
- Le joueur peut se deplacer et tirer
- Les ennemis apparaissent, tirent et avancent
- Les collisions affectent score et vies
- Le jeu se termine proprement en defaite
- Le jeu peut etre relance sans recharger la page

## Contraintes
- Aucune dependance externe JavaScript
- Structure simple pour edition locale
- Fallback si images indisponibles
