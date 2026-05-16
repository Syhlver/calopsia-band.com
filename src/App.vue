<template>
  <div class="app">
    <header class="site-header">
      <router-link to="/" class="site-title">CALOPSIA</router-link>
      <div class="header-rule"></div>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <footer class="site-footer">
      <div class="footer-rule"></div>
      <p class="footer-text">{{ currentYear }}</p>
    </footer>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app { display: flex; flex-direction: column; min-height: 100vh; }

.site-header { padding: 2.2rem 3rem 0; }

.site-title {
  display: inline-block;
  font-size: 2.0rem;
  font-weight: 600;
  letter-spacing: 0.55em;
  color: var(--ash-dim);
  text-transform: uppercase;
  transition: color 0.3s;
  text-shadow: 2px 1px 0px white;
}
.site-title:hover { color: var(--ash); }

.header-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--border-mid) 0%, transparent 55%);
  margin-top: 1.1rem;
}

.site-footer { margin-top: auto; padding: 2rem 3rem; }

.footer-rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border) 40%, transparent);
  margin-bottom: 1.2rem;
}

.footer-text {
  text-align: center;
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  color: var(--muted);
}
</style>