<template>
  <main class="track-view" v-if="track">
    <div class="ambient-bg" :style="{ '--accent': track.color }"></div>
<!-- 
    <nav class="back-nav">
      <router-link to="/" class="back-link">← Archives</router-link>
    </nav> -->

    <div class="track-layout">

      <!-- Colonne gauche -->
      <aside class="track-aside">
        <div class="cover-frame">
          <img
            :src="track.cover"
            :alt="track.title"
            class="track-cover"
            @error="onImgError"
          />
          <div class="cover-fallback" :style="{ background: fallbackBg }">
            <span class="fallback-num">{{ String(trackIndex + 1).padStart(2, '0') }}</span>
          </div>
          <div class="frame-line frame-top"    :style="{ background: track.color }"></div>
          <div class="frame-line frame-bottom" :style="{ background: track.color }"></div>
        </div>

        <!-- Métadonnées lore -->
        <div class="track-meta">
          <div class="meta-row">
            <span class="meta-label">Type</span>
            <span class="meta-val" :style="{ color: track.color }">{{ track.docType }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Date</span>
            <span class="meta-val">{{ track.loreDate }}</span>
          </div>
          <div class="meta-row" v-if="linkedTracks.length">
            <span class="meta-label">Liens</span>
            <span class="meta-links">
              <router-link
                v-for="lt in linkedTracks"
                :key="lt.id"
                :to="`/track/${lt.id}`"
                class="meta-link"
                :style="{ '--lc': lt.color }"
              >{{ lt.title }}</router-link>
            </span>
          </div>
        </div>

        <!-- Player Spotify -->
        <div class="player-block" v-if="track.spotifyId">
          <iframe
            :src="`https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`"
            width="100%"
            height="152"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            class="spotify-embed"
          ></iframe>
        </div>
 
        <!-- Pas de Spotify renseigné -->
        <div class="player-placeholder" v-else>
          <p>— bientôt disponible —</p>
        </div>
      </aside>

      <!-- Colonne droite : texte -->
      <article class="track-prose-col">
        <header class="track-header">
          <p class="track-ref">{{ String(trackIndex + 1).padStart(2, '0') }} — {{ track.docType }}</p>
          <h1 class="track-title">{{ track.title }}</h1>
          <div class="title-rule" :style="{ background: track.color }"></div>
          <p class="track-date">{{ track.loreDate }}</p>
        </header>

        <div class="prose-body" v-html="track.prose"></div>

        <div class="track-nav">
          <router-link v-if="prevTrack" :to="`/track/${prevTrack.id}`" class="tnav-link">
            <span>←</span>
            <span>{{ prevTrack.title }}</span>
          </router-link>
          <span v-else></span>
          <router-link v-if="nextTrack" :to="`/track/${nextTrack.id}`" class="tnav-link tnav-link--r">
            <span>{{ nextTrack.title }}</span>
            <span>→</span>
          </router-link>
          <span v-else></span>
        </div>
      </article>
    </div>
  </main>

  <div v-else class="not-found">
    <p>Document introuvable.</p>
    <router-link to="/">← Archives</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { tracks } from '../data/music.js'

const route   = useRoute()
const audioEl = ref(null)

const track       = computed(() => tracks.find(t => t.id === Number(route.params.id)))
const trackIndex  = computed(() => tracks.findIndex(t => t.id === Number(route.params.id)))
const prevTrack   = computed(() => trackIndex.value > 0 ? tracks[trackIndex.value - 1] : null)
const nextTrack   = computed(() => trackIndex.value < tracks.length - 1 ? tracks[trackIndex.value + 1] : null)
const linkedTracks = computed(() => {
  if (!track.value?.links) return []
  return track.value.links.map(id => tracks.find(t => t.id === id)).filter(Boolean)
})

const fallbackBg = computed(() =>
  track.value ? `linear-gradient(160deg, #111 0%, ${track.value.color}22 100%)` : '#111'
)

const isPlaying   = ref(false)
const currentTime = ref(0)
const duration    = ref(0)
const volume      = ref(0.8)
const progressPct = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

function togglePlay() {
  if (!audioEl.value) return
  if (isPlaying.value) { audioEl.value.pause(); isPlaying.value = false }
  else                 { audioEl.value.play();  isPlaying.value = true  }
}
function onTimeUpdate() { currentTime.value = audioEl.value?.currentTime ?? 0 }
function onLoaded()     { duration.value = audioEl.value?.duration ?? 0 }
function onEnded()      { isPlaying.value = false }

function seek(e) {
  if (!audioEl.value || !duration.value) return
  const r = e.currentTarget.getBoundingClientRect()
  audioEl.value.currentTime = ((e.clientX - r.left) / r.width) * duration.value
}
function rewind()  { if (audioEl.value) audioEl.value.currentTime = Math.max(0, audioEl.value.currentTime - 10) }
function forward() { if (audioEl.value) audioEl.value.currentTime = Math.min(duration.value, audioEl.value.currentTime + 10) }
function setVolume() { if (audioEl.value) audioEl.value.volume = volume.value }

function formatTime(sec) {
  const s = Math.floor(sec)
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
}

watch(() => route.params.id, () => {
  if (audioEl.value) { audioEl.value.pause(); isPlaying.value = false; currentTime.value = 0; duration.value = 0 }
})
onUnmounted(() => { if (audioEl.value) audioEl.value.pause() })

function onImgError(e) { e.target.style.display = 'none' }
</script>

<style scoped>
.track-view {
  flex: 1;
  padding: 0 3rem 5rem;
  position: relative;
  overflow: hidden;
}

.ambient-bg {
  position: fixed;
  top: -40%;
  right: -25%;
  width: 55vw;
  height: 55vw;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

.back-nav { position: relative; z-index: 1; padding: 2rem 0 2.5rem; }

.back-link {
  font-size: 0.58rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.25s;
}
.back-link:hover { color: var(--ash); }

/* Layout */
.track-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 5rem;
  position: relative;
  z-index: 1;
  align-items: start;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0px 10px 40px -3px rgba(30, 0, 70, .1), 0px 4px 6px -4px rgba(30, 0, 70, .1);
  background: #f8f8f8;
}

/* Aside */
.track-aside { position: sticky; top: 2rem; }

.cover-frame {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--surface);
  margin-bottom: 1rem;
}

.track-cover {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
  filter: saturate(0.6);
}

.cover-fallback {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 0;
}

.fallback-num {
  font-family: var(--serif);
  font-size: 7rem;
  font-weight: 400;
  color: rgba(255,255,255,0.04);
}

.frame-line {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  opacity: 0.35;
  z-index: 2;
}
.frame-top    { top: 0; }
.frame-bottom { bottom: 0; }

/* Métadonnées */
.track-meta {
  border: 1px solid var(--border);
  padding: 1rem;
  margin-bottom: 1rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--border);
}
.meta-row:last-child { border-bottom: none; }

.meta-label {
  font-size: 0.55rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--muted);
  flex-shrink: 0;
}

.meta-val {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--ash-dim);
  text-align: right;
}

.meta-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;
}

.meta-link {
  font-size: 0.58rem;
  letter-spacing: 0.15em;
  color: var(--lc, var(--ash-dim));
  opacity: 0.7;
  border-bottom: 1px solid currentColor;
  transition: opacity 0.2s;
}
.meta-link:hover { opacity: 1; }

/* Player */
.player-block {
  border: 1px solid var(--border);
  padding: 1.2rem;
  background: var(--surface);
}

.progress-bar {
  cursor: pointer;
  padding: 7px 0;
}

.progress-track {
  height: 1px;
  background: rgba(255,255,255,0.07);
  position: relative;
}

.progress-fill {
  position: absolute;
  left: 0; top: 0; height: 100%;
  transition: width 0.1s linear;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  margin: 0.5rem 0 1rem;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  margin-bottom: 1rem;
}

.ctrl-btn {
  background: none; border: none;
  color: var(--muted); font-size: 0.85rem;
  cursor: pointer; transition: color 0.2s;
  letter-spacing: 0;
}
.ctrl-btn:hover { color: var(--text); }

.play-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid;
  background: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text);
  font-size: 0.7rem; letter-spacing: 0;
  transition: background 0.2s;
}
.play-btn:hover { background: rgba(255,255,255,0.04); }

.volume-row {
  display: flex; align-items: center; gap: 0.6rem;
}

.vol-label {
  font-size: 0.5rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--muted);
}

.vol-slider {
  flex: 1; appearance: none;
  height: 1px;
  background: rgba(255,255,255,0.08);
  outline: none; cursor: pointer;
}
.vol-slider::-webkit-slider-thumb {
  appearance: none;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--vc, var(--ash-dim));
  cursor: pointer;
}

/* Spotify embed */
.player-block {
  border: 1px solid var(--border);
  overflow: hidden;
}
 
.spotify-embed {
  display: block;
  border: none;
}
 
/* Placeholder si pas de spotifyId */
.player-placeholder {
  border: 1px solid var(--border);
  padding: 1.5rem;
  text-align: center;
  font-size: 0.55rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Prose column */
.track-prose-col { padding-top: 0.5rem; }

.track-header { margin-bottom: 3rem; }

.track-ref {
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 1rem;
}

.track-title {
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  color: var(--ash);
  line-height: 1.1;
  margin-bottom: 1rem;
}

.title-rule {
  height: 1px;
  width: 32px;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.track-date {
  font-size: 0.55rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Prose */
.prose-body {
  font-family: var(--serif);
  font-size: clamp(1rem, 1.4vw, 1.1rem);
  font-weight: 200;
  line-height: 2;
  color: var(--text);
  letter-spacing: 0.015em;
}

:deep(.prose-body p) { margin-bottom: 1.8em; }

:deep(.prose-body p:first-child::first-letter) {
  font-family: var(--serif);
  font-size: 3.2em;
  font-weight: 400;
  float: left;
  line-height: 0.8;
  margin-right: 0.1em;
  margin-top: 0.06em;
  color: var(--ash-dim);
}

/* Navigation */
.track-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.tnav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.58rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--muted);
  transition: color 0.2s;
}
.tnav-link:hover { color: var(--ash); }
.tnav-link--r { text-align: right; }

/* Not found */
.not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
}

@media (max-width: 900px) {
  .track-layout { grid-template-columns: 1fr; gap: 2.5rem; }
  .track-aside { position: static; max-width: 340px; }
  .track-view { padding: 0 1.5rem 4rem; }
}
</style>