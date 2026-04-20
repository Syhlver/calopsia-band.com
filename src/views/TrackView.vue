<template>
  <main class="track-view" v-if="track">
    <!-- Fond ambiant coloré -->
    <div class="ambient-bg" :style="{ '--accent': track.color }"></div>

    <!-- Retour -->
    <nav class="back-nav">
      <router-link to="/" class="back-link">
        <span class="back-arrow">←</span>
        <span>Collection</span>
      </router-link>
    </nav>

    <!-- Contenu principal -->
    <div class="track-layout">

      <!-- Colonne gauche : image + player -->
      <aside class="track-aside">
        <div class="cover-frame" :style="{ '--accent': track.color }">
          <img
            :src="track.cover"
            :alt="track.title"
            class="track-cover"
            @error="onImgError"
          />
          <div class="cover-fallback" :style="{ background: fallbackGradient }">
            <span class="fallback-num">{{ String(trackIndex + 1).padStart(2, '0') }}</span>
          </div>

          <!-- Cadre doré animé -->
          <div class="frame-border frame-top"></div>
          <div class="frame-border frame-right"></div>
          <div class="frame-border frame-bottom"></div>
          <div class="frame-border frame-left"></div>
        </div>

        <!-- Métadonnées -->
        <div class="track-meta">
          <p class="meta-genre">{{ track.genre }}</p>
          <p class="meta-year">{{ track.subtitle }}</p>
        </div>

        <!-- Lecteur audio -->
        <div class="player-block">
          <audio
            ref="audioEl"
            :src="track.audio"
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoaded"
            @ended="onEnded"
            preload="metadata"
          ></audio>

          <!-- Barre de progression -->
          <div class="progress-bar" @click="seek">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progressPct + '%', background: track.color }"></div>
            </div>
          </div>

          <!-- Temps -->
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <!-- Boutons -->
          <div class="player-controls">
            <button class="ctrl-btn" @click="rewind">⟵</button>
            <button class="play-btn" @click="togglePlay" :style="{ borderColor: track.color }">
              <span class="play-icon">{{ isPlaying ? '❙❙' : '▶' }}</span>
            </button>
            <button class="ctrl-btn" @click="forward">⟶</button>
          </div>

          <!-- Volume -->
          <div class="volume-row">
            <span class="vol-icon">♪</span>
            <input
              type="range"
              class="vol-slider"
              min="0" max="1" step="0.01"
              v-model="volume"
              @input="setVolume"
              :style="{ '--vol-color': track.color }"
            />
          </div>
        </div>
      </aside>

      <!-- Colonne droite : prose romanesque -->
      <article class="track-prose-col">
        <!-- En-tête -->
        <header class="track-header">
          <p class="track-number">{{ String(trackIndex + 1).padStart(2, '0') }}</p>
          <h1 class="track-title">{{ track.title }}</h1>
          <div class="title-rule" :style="{ background: track.color }"></div>
        </header>

        <!-- Texte romanesque -->
        <div class="prose-body" v-html="track.prose"></div>

        <!-- Navigation entre tracks -->
        <div class="track-nav">
          <router-link
            v-if="prevTrack"
            :to="`/track/${prevTrack.id}`"
            class="track-nav-link"
          >
            <span class="nav-arrow">←</span>
            <span class="nav-label">{{ prevTrack.title }}</span>
          </router-link>
          <span v-else class="nav-empty"></span>

          <router-link
            v-if="nextTrack"
            :to="`/track/${nextTrack.id}`"
            class="track-nav-link track-nav-link--next"
          >
            <span class="nav-label">{{ nextTrack.title }}</span>
            <span class="nav-arrow">→</span>
          </router-link>
          <span v-else class="nav-empty"></span>
        </div>
      </article>
    </div>
  </main>

  <div v-else class="not-found">
    <p>Piste introuvable.</p>
    <router-link to="/">← Retour</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { tracks } from '../data/music.js'

const route  = useRoute()
const audioEl = ref(null)

// Track courante
const track = computed(() => tracks.find(t => t.id === Number(route.params.id)))
const trackIndex = computed(() => tracks.findIndex(t => t.id === Number(route.params.id)))
const prevTrack = computed(() => trackIndex.value > 0 ? tracks[trackIndex.value - 1] : null)
const nextTrack = computed(() => trackIndex.value < tracks.length - 1 ? tracks[trackIndex.value + 1] : null)

// Gradient fallback
const fallbackGradient = computed(() =>
  track.value ? `linear-gradient(135deg, #1a1a1a 0%, ${track.value.color}33 100%)` : '#1a1a1a'
)

// Player state
const isPlaying   = ref(false)
const currentTime = ref(0)
const duration    = ref(0)
const volume      = ref(0.8)
const progressPct = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

function togglePlay() {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
    isPlaying.value = false
  } else {
    audioEl.value.play()
    isPlaying.value = true
  }
}

function onTimeUpdate() { currentTime.value = audioEl.value?.currentTime ?? 0 }
function onLoaded()     { duration.value = audioEl.value?.duration ?? 0 }
function onEnded()      { isPlaying.value = false }

function seek(e) {
  if (!audioEl.value || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  audioEl.value.currentTime = ratio * duration.value
}

function rewind()  { if (audioEl.value) audioEl.value.currentTime = Math.max(0, audioEl.value.currentTime - 10) }
function forward() { if (audioEl.value) audioEl.value.currentTime = Math.min(duration.value, audioEl.value.currentTime + 10) }

function setVolume() {
  if (audioEl.value) audioEl.value.volume = volume.value
}

function formatTime(sec) {
  const s = Math.floor(sec)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// Stopper la musique quand on change de page
watch(() => route.params.id, () => {
  if (audioEl.value) {
    audioEl.value.pause()
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
  }
})

onUnmounted(() => {
  if (audioEl.value) audioEl.value.pause()
})

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.track-view {
  flex: 1;
  padding: 0 3rem 5rem;
  position: relative;
  overflow: hidden;
}

/* ---- Fond ambiant ---- */
.ambient-bg {
  position: fixed;
  top: -30%;
  right: -20%;
  width: 60vw;
  height: 60vw;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent, #c9a84c) 0%, transparent 70%);
  opacity: 0.04;
  pointer-events: none;
  z-index: 0;
  animation: ambientPulse 8s ease-in-out infinite;
}

@keyframes ambientPulse {
  0%, 100% { opacity: 0.04; transform: scale(1); }
  50%       { opacity: 0.07; transform: scale(1.05); }
}

/* ---- Nav retour ---- */
.back-nav {
  position: relative;
  z-index: 1;
  padding: 2rem 0 2.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.25s;
}
.back-link:hover { color: var(--gold); }
.back-arrow { font-size: 0.9rem; }

/* ---- Layout ---- */
.track-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 5rem;
  position: relative;
  z-index: 1;
  align-items: start;
}

/* ---- Aside ---- */
.track-aside {
  position: sticky;
  top: 2rem;
}

/* ---- Cover frame ---- */
.cover-frame {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--surface);
  margin-bottom: 1.2rem;
}

.track-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
  filter: saturate(0.9);
}

.cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.fallback-num {
  font-family: var(--serif);
  font-size: 6rem;
  font-weight: 400;
  color: rgba(255,255,255,0.07);
}

/* Cadre animé */
.frame-border {
  position: absolute;
  background: var(--accent, var(--gold));
  opacity: 0;
  animation: frameReveal 1.2s ease forwards;
  z-index: 2;
}

.frame-top, .frame-bottom { height: 1px; left: 0; right: 0; }
.frame-left, .frame-right { width: 1px; top: 0; bottom: 0; }
.frame-top    { top: 0;    animation-delay: 0.1s; }
.frame-right  { right: 0;  animation-delay: 0.4s; }
.frame-bottom { bottom: 0; animation-delay: 0.7s; }
.frame-left   { left: 0;   animation-delay: 1.0s; }

@keyframes frameReveal { from { opacity: 0; } to { opacity: 0.5; } }

/* ---- Métadonnées ---- */
.track-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}

.meta-genre {
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent, var(--gold));
}

.meta-year {
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--muted);
}

/* ---- Player ---- */
.player-block {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.4rem;
}

.progress-bar {
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 0.5rem;
}

.progress-track {
  height: 1px;
  background: rgba(255,255,255,0.1);
  position: relative;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.1s linear;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 1.2rem;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
}

.ctrl-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.25s;
  padding: 4px;
  letter-spacing: 0;
}
.ctrl-btn:hover { color: var(--text); }

.play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s, transform 0.15s;
  color: var(--text);
}
.play-btn:hover { background: rgba(255,255,255,0.05); transform: scale(1.05); }
.play-icon { font-size: 0.75rem; letter-spacing: 0; }

.volume-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.vol-icon { font-size: 0.65rem; color: var(--muted); }

.vol-slider {
  flex: 1;
  appearance: none;
  height: 1px;
  background: rgba(255,255,255,0.1);
  outline: none;
  cursor: pointer;
}
.vol-slider::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vol-color, var(--gold));
  cursor: pointer;
}

/* ---- Prose column ---- */
.track-prose-col {
  padding-top: 0.5rem;
}

.track-header {
  margin-bottom: 3rem;
}

.track-number {
  font-size: 0.6rem;
  letter-spacing: 0.35em;
  color: var(--muted);
  margin-bottom: 0.8rem;
}

.track-title {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  font-weight: 400;
  color: var(--cream);
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 1.2rem;
}

.title-rule {
  height: 1px;
  width: 60px;
  opacity: 0.7;
}

/* ---- Prose body ---- */
.prose-body {
  font-family: var(--italic);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-weight: 300;
  line-height: 1.9;
  color: rgba(232, 224, 208, 0.85);
  letter-spacing: 0.01em;
}

:deep(.prose-body p) {
  margin-bottom: 1.6em;
}

:deep(.prose-body p:first-child::first-letter) {
  font-family: var(--serif);
  font-size: 3.5em;
  font-weight: 600;
  float: left;
  line-height: 0.8;
  margin-right: 0.1em;
  margin-top: 0.05em;
  color: var(--gold);
}

/* ---- Navigation ---- */
.track-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.track-nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.25s;
}
.track-nav-link:hover { color: var(--gold); }
.track-nav-link--next { text-align: right; }
.nav-arrow { font-size: 0.9rem; }
.nav-empty { flex: 1; }

/* ---- Responsive ---- */
@media (max-width: 900px) {
  .track-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .track-aside {
    position: static;
    max-width: 360px;
    margin: 0 auto;
  }
  .track-view { padding: 0 1.5rem 4rem; }
}

/* ---- Not found ---- */
.not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--muted);
}
</style>
