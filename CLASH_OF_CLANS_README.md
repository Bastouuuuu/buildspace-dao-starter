# Clash of Clans Dashboard

Une interface web moderne pour analyser vos performances et celles de votre clan dans Clash of Clans.

## Fonctionnalités

### Dashboard Joueur

- **Vue Résumé**: Profil complet avec badges, trophées, ligue, et statistiques de clan
- **Tech Tree**: Visualisation de toutes vos troupes, sorts et héros avec leurs niveaux
- **War Readiness Score**: Score composite intelligent qui évalue votre préparation pour la guerre
  - Analyse des héros (40% du score)
  - Analyse des troupes (30% du score)
  - Analyse des sorts (20% du score)
  - Analyse des donations (10% du score)
- **Recommandations**: Suggestions personnalisées pour améliorer votre profil
- **Évolution**: Suivi de vos performances sur 7 jours

### Dashboard Clan

- **Vue d'ensemble**: Santé du clan avec distribution des Town Halls et activité
- **Liste des Membres**: Tableau complet avec rôles, donations, trophées
- **War Room**: Guerre en cours avec statistiques détaillées et historique
- **Capital Raids**: Performance du clan sur les raids du capital

## Installation

### 1. Prérequis

- Node.js version 16 ou supérieure
- Un token API Clash of Clans (voir ci-dessous)

### 2. Installer les dépendances

```bash
npm install
```

### 3. Obtenir un token API Clash of Clans

1. Allez sur [https://developer.clashofclans.com](https://developer.clashofclans.com)
2. Créez un compte ou connectez-vous
3. Créez une nouvelle clé API:
   - Nom: "My Dashboard" (ou autre)
   - Description: "Dashboard personnel"
   - IP autorisée: Votre adresse IP publique (trouvable sur [https://whatismyipaddress.com](https://whatismyipaddress.com))
4. Copiez le token généré

### 4. Configuration

Vous avez deux options pour configurer votre token API:

#### Option A: Via l'interface (recommandé)

1. Lancez l'application avec `npm start`
2. Sur la page d'accueil, collez votre token dans le champ "Token API Clash of Clans"
3. Cliquez sur "Sauvegarder"

#### Option B: Via fichier .env

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez votre token:
   ```
   REACT_APP_COC_API_TOKEN=votre_token_ici
   ```

### 5. Lancer l'application

```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Utilisation

### Rechercher un joueur

1. Sur la page d'accueil, entrez un tag de joueur (ex: #ABC123)
2. Le tag peut être avec ou sans le symbole #
3. Cliquez sur "Rechercher"

### Rechercher un clan

1. Sur la page d'accueil, entrez un tag de clan (ex: #XYZ789)
2. Cliquez sur "Rechercher"

### Définir des favoris

- Sur un profil de joueur ou de clan, cliquez sur "⭐ Définir comme favori"
- Vous pourrez ensuite y accéder rapidement depuis la page d'accueil

### Navigation

- Cliquez sur le nom du clan d'un joueur pour voir le dashboard du clan
- Dans la liste des membres d'un clan, cliquez sur "Voir" pour voir le profil d'un joueur
- Utilisez le bouton "← Retour" pour revenir à l'accueil

## Comprendre le War Readiness Score

Le War Readiness Score est un score composite (0-100) qui évalue votre préparation pour la guerre:

### Calcul

- **Héros (40%)**: Niveau de vos héros par rapport au maximum pour votre TH
  - Les héros ont des poids différents (Archer Queen > Grand Warden > Royal Champion > Barbarian King)
- **Troupes (30%)**: Niveau de vos troupes, avec un bonus pour les troupes méta
- **Sorts (20%)**: Niveau de vos sorts importants
- **Donations (10%)**: Ratio donations données/reçues

### Interprétation

- **85-100 (EXCELLENT)**: Prêt pour la guerre, profil optimal
- **70-84 (GOOD)**: Bon niveau, quelques améliorations possibles
- **50-69 (AVERAGE)**: Niveau moyen, plusieurs améliorations nécessaires
- **0-49 (POOR)**: Niveau faible, beaucoup d'améliorations nécessaires

### Recommandations

Le système génère automatiquement des recommandations prioritaires:

- **HIGH**: Améliorations critiques (héros en retard, troupes méta faibles)
- **MEDIUM**: Améliorations importantes (sorts, équilibre général)
- **LOW**: Améliorations optionnelles (optimisations)

## Fonctionnalités avancées

### Historique et évolution

L'application stocke automatiquement l'historique de vos données dans le navigateur:

- **Joueurs**: Snapshots toutes les visites (max 100)
- **Clans**: Snapshots toutes les visites (max 100)
- **Guerres**: Historique des 50 dernières guerres
- **Capital**: Historique des 20 dernières saisons

Ces données permettent:
- De voir l'évolution de vos trophées
- De calculer vos donations sur une période
- D'analyser vos performances en guerre
- De comparer vos performances dans le temps

### Données stockées localement

Toutes les données sont stockées dans le localStorage de votre navigateur:
- Token API
- Favoris (joueur et clan)
- Historique des performances
- Paramètres de l'application

## Limitations de l'API

L'API Clash of Clans ne fournit pas:

- Les niveaux des bâtiments/murs/pièges (non disponible via l'API)
- L'historique complet des performances (uniquement les données actuelles)
- Les détails des attaques individuelles après la fin d'une guerre

Pour contourner ces limitations, l'application:
- Historise les données lors de chaque visite
- Stocke les performances de guerre pendant qu'elles sont accessibles
- Permet de suivre l'évolution dans le temps

## Dépannage

### Erreur "401 Unauthorized"

Votre token API est invalide ou expiré:
1. Vérifiez que vous avez bien entré le token
2. Vérifiez que votre IP est autorisée sur le portail développeur
3. Générez un nouveau token si nécessaire

### Erreur "404 Not Found"

Le tag du joueur ou du clan n'existe pas:
1. Vérifiez que le tag est correct (avec ou sans #)
2. Assurez-vous que le tag existe dans le jeu

### Erreur "403 Forbidden"

Le war log du clan est privé:
- Certaines fonctionnalités ne seront pas disponibles
- Le chef du clan peut rendre le war log public dans les paramètres du clan

### Données manquantes

Si certaines données ne s'affichent pas:
1. Rafraîchissez la page avec le bouton "🔄 Rafraîchir"
2. Vérifiez que le joueur/clan a bien ces données (ex: certains joueurs n'ont pas de héros)

## Structure du projet

```
src/
├── components/          # Composants React
│   ├── Home.jsx        # Page d'accueil
│   ├── PlayerDashboard.jsx  # Dashboard joueur
│   └── ClanDashboard.jsx    # Dashboard clan
├── hooks/              # Hooks personnalisés
│   ├── usePlayer.js    # Hook pour les données joueur
│   ├── useClan.js      # Hook pour les données clan
│   ├── useWar.js       # Hook pour les données de guerre
│   └── useCapital.js   # Hook pour le capital
├── services/           # Services API et stockage
│   ├── clashOfClansApi.js   # Service API CoC
│   ├── cocConstants.js      # Constantes et données de référence
│   └── storageService.js    # Service de stockage local
├── utils/              # Utilitaires
│   └── warReadinessCalculator.js  # Calcul du War Readiness Score
├── App.jsx             # Composant principal avec routing
├── index.js            # Point d'entrée
└── index.css           # Styles globaux
```

## Technologies utilisées

- **React 17**: Framework frontend
- **React Router 6**: Routing
- **Axios**: Requêtes HTTP
- **localStorage**: Stockage local des données
- **CSS3**: Styling avec gradients et animations

## Contribution

Pour contribuer au projet:

1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## License

Ce projet est sous licence MIT.

## Support

Pour obtenir de l'aide:

1. Consultez la [documentation officielle de l'API Clash of Clans](https://developer.clashofclans.com/#/documentation)
2. Ouvrez une issue sur GitHub
3. Rejoignez notre communauté Discord (si disponible)

## Roadmap

Fonctionnalités à venir:

- [ ] Export des données en CSV/JSON
- [ ] Graphiques d'évolution détaillés
- [ ] Comparaison entre joueurs
- [ ] Notifications pour les guerres
- [ ] Mode sombre/clair
- [ ] Support multi-langues
- [ ] Planificateur d'améliorations
- [ ] Calculateur de ressources

## Remerciements

- Supercell pour l'API Clash of Clans
- La communauté Clash of Clans
- Tous les contributeurs du projet
