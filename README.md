# pari-pmu-direct

Pari-PMU-Direct - Android app for live horse racing with free access and single-device premium licensing via Chariow.

## Journal de trading (PC)

Le fichier `trading-journal.html` est un petit outil en français, utilisable hors ligne et installé localement sur Windows.

### Installer sur son PC

Le projet est configuré pour Vercel via `vercel.json`. Après avoir importé ce dépôt dans Vercel et déployé la branche `main`, partagez l’adresse HTTPS du site suivie de `/trading-journal.html`. Chaque personne ouvre ce lien dans Chrome ou Edge, puis choisit **Installer l’application** dans la page ou utilise l’icône d’installation du navigateur. Il faut une adresse HTTPS complète : un nom de fichier ou un chemin local n’est pas un lien installable.

Le site ne publie que les fichiers du journal. Les trades et captures restent dans le stockage local du navigateur de chaque personne ; ils ne sont pas synchronisés entre utilisateurs. Exportez régulièrement le journal en CSV.

- Calculez une taille indicative à partir du capital, du risque, de la distance entrée-stop, de la taille du point et de sa valeur par lot.
- Consignez la date, l’actif, le setup, l’entrée, le stop, l’objectif, la taille, le risque, le résultat en R, le respect du plan, l’émotion et le lien/chemin de la capture.
- Modifiez ou supprimez les trades et exportez le journal en CSV pour le sauvegarder ou l’ouvrir dans un tableur.

Le calcul de taille est indicatif, ne comprend pas les frais et dépend de la valeur du pip/point et des caractéristiques du contrat chez votre courtier. Vérifiez ces paramètres avant tout ordre.
