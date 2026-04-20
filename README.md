# My Music — Site cinématique

Site d'exposition musicale avec grid de pochettes et pages détaillées romanesques.
**Stack** : Vue.js 3 + Vite — entièrement statique, déployable sur GitHub Pages.

---

## Structure du projet

```
music-site/
├── public/
│   ├── covers/          ← Tes pochettes (cover-01.jpg … cover-09.jpg)
│   └── audio/           ← Tes fichiers audio (track-01.mp3 … track-09.mp3)
├── src/
│   ├── data/
│   │   └── music.js     ← ⭐ Fichier principal à éditer
│   ├── views/
│   │   ├── GridView.vue ← Grille 3×3
│   │   └── TrackView.vue← Page détaillée
│   └── assets/
│       └── global.css   ← Thème sombre/or
└── .github/workflows/
    └── deploy.yml       ← Déploiement automatique
```

---

## 1. Ajouter tes musiques

### Fichiers médias

Place tes fichiers dans `public/` :
```
public/covers/cover-01.jpg   (ou .png, .webp)
public/audio/track-01.mp3    (ou .ogg, .wav)
```

> **Taille recommandée pour les pochettes** : 800×800 px minimum, format carré.

### Éditer les métadonnées

Ouvre `src/data/music.js` et remplis chaque track :

```js
{
  id: 1,
  title: "Nom de ta musique",
  subtitle: "2024",           // Année ou description courte
  genre: "Ambient",           // Tag affiché sur la pochette
  cover: "covers/cover-01.jpg",
  audio: "audio/track-01.mp3",
  color: "#c9a84c",           // Couleur d'accent (hex) — adapte à ta pochette
  prose: `
    <p>Ton texte romanesque ici...</p>
    <p>Deuxième paragraphe...</p>
  `
}
```

**Astuce `color`** : choisis une couleur dominante de ta pochette pour un rendu cohérent.

---

## 2. Installer & lancer en local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
# → http://localhost:5173

# Builder pour la production
npm run build
```

---

## 3. Déployer sur GitHub Pages

### Première fois

1. Crée un repo GitHub (ex. `mon-site-music`)
2. Dans ton repo GitHub → **Settings** → **Pages** → Source : **GitHub Actions**
3. Push le projet :

```bash
cd music-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/mon-site-music.git
git push -u origin main
```

4. GitHub Actions se déclenche automatiquement → ton site sera accessible à :
   `https://TON-USERNAME.github.io/mon-site-music/`

### Mises à jour

```bash
git add .
git commit -m "Ajout nouvelle musique"
git push
```

Le site se redéploie automatiquement en ~1 minute.

---

## 4. Ajouter plus de 9 musiques

La grille s'adapte automatiquement — ajoute simplement de nouveaux objets dans le tableau `tracks` dans `music.js`. La grille passera à 4 colonnes si tu as 12+ titres (à ajuster dans `GridView.vue`, propriété `grid-template-columns`).

---

## 5. Personnaliser le design

| Élément | Fichier |
|---|---|
| Couleurs globales | `src/assets/global.css` → variables `:root` |
| Titre du site | `src/App.vue` |
| Typographie | `index.html` (import Google Fonts) + `global.css` |
| Mise en page grille | `src/views/GridView.vue` |
| Page détaillée | `src/views/TrackView.vue` |

---

## Formats audio supportés

- `.mp3` — recommandé (compatible partout)
- `.ogg` — meilleure compression (non supporté Safari)
- `.wav` — sans perte mais lourd
- `.flac` — non recommandé pour le web

---

*Site généré avec Vue 3 + Vite. Aucun backend requis.*
