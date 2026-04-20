<template>
  <div class="app">
    <header class="site-header">
      <router-link to="/" class="site-title">
        <span class="title-line">MY</span>
        <span class="title-divider">◆</span>
        <span class="title-line">MUSIC</span>
      </router-link>
      <div class="header-rule"></div>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <footer class="site-footer">
      <div class="footer-line"></div>
      <p class="footer-text">{{ currentYear }}</p>
    </footer>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ---- Header ---- */
.site-header {
  padding: 2.5rem 3rem 0;
  position: relative;
  z-index: 10;
}

.site-title {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  letter-spacing: 0.35em;
  font-size: 0.75rem;
  font-weight: 100;
  color: var(--gold);
  text-transform: uppercase;
  transition: opacity 0.3s;
}
.site-title:hover { opacity: 0.7; }

.title-divider {
  font-size: 0.4rem;
  opacity: 0.6;
}

.header-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--gold-dim) 0%, transparent 60%);
  margin-top: 1.2rem;
}

/* ---- Footer ---- */
.site-footer {
  margin-top: auto;
  padding: 2rem 3rem;
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-dim) 50%, transparent 100%);
  margin-bottom: 1.2rem;
}

.footer-text {
  text-align: center;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--muted);
}
</style>
