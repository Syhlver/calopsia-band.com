# Calopsia
 
Music showcase site with a grid of covers and detailed narrative pages.
Stories by Pauline Nordor
Music and lyrics by Calopsia

**Stack**: Vue.js 3 + Vite — fully static, deployable on GitHub Pages.
 
---
 
## Project structure
 
```
calopsia/
├── public/
│   └── covers/          ← Cover images
├── src/
│   ├── data/
│   │   └── music.js     ← Main data file
│   ├── views/
│   │   ├── GridView.vue ← 3×3 grid
│   │   └── TrackView.vue← Detail page
│   └── assets/
│       └── global.css   ← Global styles
└── .github/workflows/
    └── deploy.yml       ← Auto-deployment
```
 
---
 
## Adding tracks
 
### Cover images
 
Place cover files in `public/covers/`:
```
public/covers/the_unknown.jpg
public/covers/another_track.jpg
```
 
Recommended size: 800×800 px minimum, square format.
 
### Track data
 
Edit `src/data/music.js`:
 
```js
{
  id: 1,
  title: "Track title",
  docType: "Deposition",      // Document type in the lore
  loreDate: "Cycle 14 — Day 3",
  cover: "covers/the_unknown.jpg",
  spotifyId: "4uLU6hMCjMI75M1A2tKUQC", // from the Spotify track URL
  color: "#22a6e3",           // Accent color (hex)
  links: [2, 4],              // IDs of related tracks
  prose: `
    <p>Narrative text here.</p>
  `
}
```
 
The `spotifyId` is the last segment of any Spotify track URL:
`https://open.spotify.com/track/`**`4uLU6hMCjMI75M1A2tKUQC`**
 
If `spotifyId` is not set, the player area will display a placeholder.
 
---
 
## Local development
 
```bash
pnpm install
pnpm run dev
# → http://localhost:5173
 
pnpm run build
```
 
---
 
## Deployment
 
The project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.
 
### First-time setup
 
1. Create a GitHub repository
2. Go to **Settings → Pages → Source**: set to **GitHub Actions**
3. Push the project:
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
 
### Updates
 
```bash
git add .
git commit -m "add track"
git push
```
 
The site rebuilds automatically in about a minute.
 
---
 
## Customization
 
| Element | File |
|---|---|
| Global colors & fonts | `src/assets/global.css` |
| Site name | `src/App.vue` |
| Font imports | `index.html` |
| Grid layout | `src/views/GridView.vue` |
| Detail page | `src/views/TrackView.vue` |