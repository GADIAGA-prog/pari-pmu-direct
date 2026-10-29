# pari-pmu-direct

Pari-PMU-Direct - Android app for live horse racing with free access and single-device premium licensing via Chariow.

## Journal de trading (PC)

Le fichier `trading-journal.html` est un petit outil en français et utilisable hors ligne. Sur Windows, vous pouvez l’ouvrir dans Edge, Chrome ou Firefox. Il peut aussi être installé comme application web progressive (PWA) lorsqu’il est hébergé sur une adresse HTTPS.

Le workflow `.github/workflows/deploy-trading-journal.yml` publie l’outil sur GitHub Pages après chaque changement de ses fichiers sur `main`. Une fois ce changement fusionné et le premier déploiement terminé, ouvrez [https://gadiaga-prog.github.io/pari-pmu-direct/trading-journal.html](https://gadiaga-prog.github.io/pari-pmu-direct/trading-journal.html) dans Chrome ou Edge, puis choisissez « Installer l’application » ou l’icône d’installation de la barre d’adresse. Ce lien HTTPS est nécessaire : un chemin de fichier, un lien `file://` ou le texte `trading-journal.html` seul ne permet pas l’installation et peut être recherché par le navigateur.

- Calculez une taille indicative à partir du capital, du risque, de la distance entrée-stop, de la taille du point et de sa valeur par lot.
- Consignez la date, l’actif, le setup, l’entrée, le stop, l’objectif, la taille, le risque, le résultat en R, le respect du plan, l’émotion et le lien/chemin de la capture.
- Modifiez ou supprimez les trades et exportez le journal en CSV pour le sauvegarder ou l’ouvrir dans un tableur.

Les données sont stockées dans le navigateur utilisé, sur ce PC ; elles ne sont pas envoyées en ligne. Exportez régulièrement le CSV. Le calcul de taille est indicatif, ne comprend pas les frais et dépend de la valeur du pip/point et des caractéristiques du contrat chez votre courtier. Vérifiez ces paramètres avant tout ordre.
