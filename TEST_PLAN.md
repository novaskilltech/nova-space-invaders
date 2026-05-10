# Test Plan - Nova Rescue

## Tests fonctionnels
- Ouvrir `index.html` dans un navigateur moderne
- Verifier l'affichage du tableau de bord et du canvas
- Cliquer sur `Demarrer la mission`
- Verifier le deplacement avec `A/D` et fleches
- Verifier le tir avec `Espace`
- Verifier que le score augmente lors de la destruction d'un ennemi
- Verifier la perte de vie lors d'un impact ennemi
- Verifier `P` pour pause / reprise
- Verifier `R` apres defaite pour relancer
- Atteindre une vague multiple de 3 et verifier l'apparition du boss

## Tests techniques
- Verification interne au chargement via `runSelfChecks()`
- Verification syntaxique JavaScript via un parseur local si disponible
- Verification HTML/CSS par inspection navigateur

## Risques restants
- Les assets `.png` fournis semblent en realite etre des JPEG renommes
- Le comportement exact peut varier sur navigateurs anciens
