# pari-pmu-direct

Pari-PMU-Direct - Android app for live horse racing with free access and single-device premium licensing via Chariow.

## Journal de trading (PC)

Le fichier `trading-journal.html` est un petit outil en français et utilisable hors ligne. Sur Windows, vous pouvez l’ouvrir dans Edge, Chrome ou Firefox. Il peut aussi être installé comme application web progressive (PWA) lorsqu’il est hébergé sur une adresse HTTPS.

### Installer en application sur PC

Le projet est configuré pour Vercel avec `vercel.json`. Pour obtenir votre lien HTTPS, connectez-vous à Vercel, choisissez **Add New → Project**, importez `GADIAGA-prog/pari-pmu-direct` depuis GitHub et déployez la branche `main`. Vercel lira automatiquement `vercel.json`, construira le dossier `dist/` contenant uniquement le journal et ses fichiers PWA, puis fournira une adresse `https://…vercel.app`.

Ouvrez ensuite cette adresse suivie de `/trading-journal.html` dans Chrome ou Edge. Cliquez sur **Installer l’application** dans la page ou sur l’icône d’installation dans la barre d’adresse. Un fichier local, une adresse `file://` ou le nom `trading-journal.html` saisi seul ne permet pas l’installation : le navigateur a besoin du lien HTTPS complet.

- Calculez une taille indicative à partir du capital, du risque, de la distance entrée-stop, de la taille du point et de sa valeur par lot.
- Consignez la date, l’actif, le setup, l’entrée, le stop, l’objectif, la taille, le risque, le résultat en R, le respect du plan, l’émotion et le lien/chemin de la capture.
- Modifiez ou supprimez les trades et exportez le journal en CSV pour le sauvegarder ou l’ouvrir dans un tableur.

Les données sont stockées dans le navigateur utilisé, sur ce PC ; elles ne sont pas envoyées en ligne. Exportez régulièrement le CSV. Le calcul de taille est indicatif, ne comprend pas les frais et dépend de la valeur du pip/point et des caractéristiques du contrat chez votre courtier. Vérifiez ces paramètres avant tout ordre.
