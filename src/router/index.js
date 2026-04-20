import { createRouter, createWebHashHistory } from 'vue-router'
import GridView from '../views/GridView.vue'
import TrackView from '../views/TrackView.vue'

const routes = [
  { path: '/', component: GridView },
  { path: '/track/:id', component: TrackView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
