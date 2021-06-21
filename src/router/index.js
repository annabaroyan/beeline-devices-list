import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue';
import DevicesList from '../views/DevicesList.vue';
import AddDevice from '../views/AddDevice.vue';
import DeviceDetail from '../views/DeviceDetail.vue';

const routes = [
  {
    path: '/',
    name: 'DevicesList',
    component: DevicesList
  },
  {
    path: '/device/add',
    name: 'AddDevice',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AddDevice.vue')
  },
  {
    path: '/device/:id',
    name: 'DeviceDetail',
    component: DeviceDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
