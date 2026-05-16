<template>
  <main class="grid-view">
    <section class="intro">
      <!-- <p class="intro-ref">Archives — {{ tracks.length }} entrées</p> -->
      <!-- <h1 class="intro-title">Documents</h1> -->
    </section>

    <section class="grid-container">
      <div class="music-grid">
        <router-link
          v-for="(track, index) in tracks"
          :key="track.id"
          :to="`/track/${track.id}`"
          class="grid-item"
          :style="{ '--item-index': index, '--accent': track.color }"
        >
          <div class="cover-wrapper">
            <img
              :src="track.cover"
              :alt="track.title"
              class="cover-img"
              loading="lazy"
              @error="onImgError"
            />
            <div class="cover-placeholder" :style="{ background: placeholderBg(track.color) }">
              <span class="placeholder-num">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="cover-overlay">
              <div class="overlay-content">
                <p class="overlay-doctype">{{ track.docType }}</p>
                <h2 class="overlay-title">{{ track.title }}</h2>
                <p class="overlay-date">{{ track.subtitle }}</p>
              </div>
            </div>
            <div class="accent-bar" :style="{ background: track.color }"></div>
          </div>

          <div class="item-info">
            <span class="item-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h2 class="item-title">{{ track.title }}</h2>
          </div>
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { tracks } from '../data/music.js'

function placeholderBg(color) {
  return `linear-gradient(160deg, #111 0%, ${color}18 100%)`
}
function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.grid-view { padding: 0 3rem 5rem; flex: 1; }

.intro {
  padding: 3rem 0 2.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 2px;
}

.intro-ref {
  font-size: 0.55rem;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.7rem;
}

.intro-title {
  font-family: var(--serif);
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 400;
  font-style: italic;
  color: var(--text);
  letter-spacing: -0.01em;
}

.music-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.grid-item {
  display: block;
  cursor: pointer;
  animation: fadeIn 0.6s ease both;
  animation-delay: calc(var(--item-index) * 0.06s);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--surface);
}

.cover-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 0.6s ease, filter 0.4s ease;
  filter: saturate(0.5) brightness(0.85);
}

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
  font-size: 5rem;
  font-weight: 400;
  color: rgba(255,255,255,0.04);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 55%, transparent 100%);
  display: flex;
  align-items: flex-end;
  padding: 1.3rem;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 2;
}

.overlay-content {
  transform: translateY(6px);
  transition: transform 0.35s ease;
}

.overlay-doctype {
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0.8;
  margin-bottom: 0.35rem;
}

.overlay-title {
  font-family: var(--serif);
  font-size: 1rem;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.overlay-date {
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  color: var(--muted);
}

.accent-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.grid-item:hover .cover-img {
  transform: scale(1.03);
  filter: saturate(0.7) brightness(0.75);
}

.grid-item:hover .cover-overlay { opacity: 1; }
.grid-item:hover .overlay-content { transform: translateY(0); }
.grid-item:hover .accent-bar { opacity: 0.6; }

.item-info {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.75rem 0 0.9rem;
  border-bottom: 1px solid var(--border);
}

.item-index {
  font-size: 0.55rem;
  color: var(--muted);
  flex-shrink: 0;
  letter-spacing: 0.1em;
}

.item-title {
  font-family: var(--serif);
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--ash-dim);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .grid-view { padding: 0 1rem 3rem; }
  .music-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .music-grid { grid-template-columns: 1fr; }
}
</style>