<template>
  <main class="grid-view">
    <!-- Intro -->
    <section class="intro">
      <h1 class="intro-title">
        <em>Une collection</em>
      </h1>
      <p class="intro-sub">Cliquez sur une pochette pour entrer dans l'œuvre</p>
    </section>

    <!-- Grid 3×3 -->
    <section class="grid-container">
      <div class="music-grid">
        <router-link
          v-for="(track, index) in tracks"
          :key="track.id"
          :to="`/track/${track.id}`"
          class="grid-item"
          :style="{ '--item-index': index, '--accent': track.color }"
        >
          <!-- Pochette -->
          <div class="cover-wrapper">
            <img
              :src="track.cover"
              :alt="track.title"
              class="cover-img"
              loading="lazy"
              @error="onImgError"
            />
            <div class="cover-placeholder" :style="{ background: placeholderGradient(track.color) }">
              <span class="placeholder-num">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="cover-overlay">
              <div class="overlay-content">
                <p class="overlay-genre">{{ track.genre }}</p>
                <h2 class="overlay-title">{{ track.title }}</h2>
                <p class="overlay-year">{{ track.subtitle }}</p>
                <span class="overlay-cta">Écouter →</span>
              </div>
            </div>
          </div>

          <!-- Info sous la pochette -->
          <div class="item-info">
            <p class="item-index">{{ String(index + 1).padStart(2, '0') }}</p>
            <h2 class="item-title">{{ track.title }}</h2>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { tracks } from '../data/music.js'

function placeholderGradient(color) {
  return `linear-gradient(135deg, #1a1a1a 0%, ${color}22 100%)`
}

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.grid-view {
  padding: 0 3rem 4rem;
  flex: 1;
}

/* ---- Intro ---- */
.intro {
  padding: 3.5rem 0 3rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}

.intro-title {
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  font-style: italic;
  color: var(--cream);
  letter-spacing: -0.01em;
  margin-bottom: 0.6rem;
}

.intro-sub {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--muted);
  text-transform: uppercase;
}

/* ---- Grid ---- */
.grid-container {
  max-width: 1200px;
}

.music-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

/* ---- Grid Item ---- */
.grid-item {
  display: block;
  cursor: pointer;
  animation: fadeUp 0.7s ease both;
  animation-delay: calc(var(--item-index) * 0.07s);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--surface);
}

/* Image réelle */
.cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.5s ease;
  filter: saturate(0.8) brightness(0.9);
  z-index: 1;
}

/* Placeholder quand pas d'image */
.cover-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.placeholder-num {
  font-family: var(--serif);
  font-size: 4rem;
  font-weight: 400;
  color: rgba(255,255,255,0.08);
  letter-spacing: -0.02em;
}

/* Overlay au hover */
.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.92) 0%,
    rgba(0,0,0,0.5) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.overlay-content {
  transform: translateY(8px);
  transition: transform 0.4s ease;
}

.overlay-genre {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent, var(--gold));
  margin-bottom: 0.4rem;
}

.overlay-title {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--cream);
  margin-bottom: 0.2rem;
}

.overlay-year {
  font-size: 0.65rem;
  color: var(--muted);
  letter-spacing: 0.2em;
  margin-bottom: 0.8rem;
}

.overlay-cta {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--accent, var(--gold));
  text-transform: uppercase;
}

/* Hover states */
.grid-item:hover .cover-img {
  transform: scale(1.04);
  filter: saturate(1) brightness(0.7);
}

.grid-item:hover .cover-overlay {
  opacity: 1;
}

.grid-item:hover .overlay-content {
  transform: translateY(0);
}

/* Ligne décorative sur le bord gauche au hover */
.cover-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent, var(--gold));
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.4s ease;
  z-index: 3;
}

.grid-item:hover .cover-wrapper::before {
  transform: scaleY(1);
}

/* Info sous la pochette */
.item-info {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  padding: 0.8rem 0 1rem;
  border-bottom: 1px solid var(--border);
}

.item-index {
  font-size: 0.6rem;
  color: var(--accent, var(--gold));
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.item-title {
  font-family: var(--serif);
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .grid-view { padding: 0 1rem 3rem; }
  .music-grid { grid-template-columns: repeat(2, 1fr); }
  .intro { padding: 2rem 0; }
}

@media (max-width: 480px) {
  .music-grid { grid-template-columns: 1fr; }
}
</style>
