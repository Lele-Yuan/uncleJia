import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('views/Home.vue')
  },
  {
    path: '/AutoComplete',
    name: 'AutoComplete',
    component: () => import(/* webpackChunkName: "AutoComplete" */'views/AutoComplete/Index.vue')
  },
  {
    path: '/excel',
    name: 'ExcelTable',
    component: () => import(/* webpackChunkName: "ExcelTable" */ 'views/excelTable/Index.vue')
  },
  {
    path: '/face',
    name: 'LiveFace',
    component: () => import(/* webpackChunkName: "LiveFace" */ 'views/LiveFace/Index.vue')
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import(/* webpackChunkName: "LiveFace" */ 'views/canvas/Index.vue')
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory('/uncleJia/dist/'),
  routes
})

export default router
