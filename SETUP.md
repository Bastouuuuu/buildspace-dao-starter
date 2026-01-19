# Setup Guide - Clash of Clans Dashboard

## Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration de l'API Token

Obtenez votre token API sur [https://developer.clashofclans.com](https://developer.clashofclans.com)

**Important**: Vous devez autoriser votre adresse IP actuelle lors de la création du token.

### 3. Lancer l'application

```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Configuration avancée

### Variables d'environnement

Créez un fichier `.env` à la racine:

```bash
# Token API Clash of Clans
REACT_APP_COC_API_TOKEN=votre_token_ici
```

**Alternative**: Vous pouvez aussi configurer le token directement dans l'interface web sur la page d'accueil.

### Compatibilité Node.js

Ce projet utilise react-scripts 4.0.0 qui nécessite Node.js 16.

Si vous utilisez Node.js 18+, les scripts `start` et `build` incluent déjà `NODE_OPTIONS=--openssl-legacy-provider` pour assurer la compatibilité.

#### Basculer entre versions de Node.js

Avec nvm:
```bash
# Installer Node 16
nvm install 16
nvm use 16

# Ou utiliser Node 22 avec le flag
nvm use 22
npm start  # Fonctionne grâce au NODE_OPTIONS
```

## Build de production

```bash
npm run build
```

Le build sera créé dans le dossier `build/`.

Pour tester le build localement:
```bash
npx serve -s build
```

## Structure du code

Consultez [CLASH_OF_CLANS_README.md](./CLASH_OF_CLANS_README.md) pour:
- La documentation complète des fonctionnalités
- La structure détaillée du projet
- Le guide d'utilisation
- Les explications du War Readiness Score

## Problèmes courants

### Build échoue avec "digital envelope routines::unsupported"

**Solution**: Les scripts npm incluent déjà le fix. Si le problème persiste:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### "401 Unauthorized" lors des requêtes API

**Solutions**:
1. Vérifiez que votre token API est valide
2. Assurez-vous que votre IP actuelle est autorisée sur le portail développeur
3. Créez un nouveau token si nécessaire

### Tags de joueur/clan non trouvés

Les tags doivent être au format `#ABC123` (avec ou sans #).

Exemples valides:
- `#2PP`
- `2PP`
- `#8YC0VRU9`

## Développement

### Lancer en mode développement

```bash
npm start
```

Changes will auto-reload.

### Tests

```bash
npm test
```

### Linter

Le projet utilise ESLint avec la configuration react-app par défaut.

## Déploiement

### Netlify / Vercel

1. Connectez votre repository
2. Ajoutez la variable d'environnement `REACT_APP_COC_API_TOKEN`
3. Build command: `npm run build`
4. Publish directory: `build`

**Important**: Pour Netlify/Vercel, vous devez autoriser leurs IPs ou désactiver la restriction IP sur votre token API (non recommandé pour la production).

### Avec Docker

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV REACT_APP_COC_API_TOKEN=your_token_here

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build et run:
```bash
docker build -t coc-dashboard .
docker run -p 80:80 coc-dashboard
```

## Support

Pour plus d'informations, consultez:
- [README principal](./CLASH_OF_CLANS_README.md)
- [Documentation API Clash of Clans](https://developer.clashofclans.com/#/documentation)
- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)

## License

MIT
