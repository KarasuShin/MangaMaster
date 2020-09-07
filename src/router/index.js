import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/author',
    name: 'Author',
    component: () => import('../views/Author.vue'),
  },
  {
    path: '/tag',
    name: 'Tag',
    component: () => import('../views/Tag.vue'),
  },
  {
    path: '/manga/edit/:id',
    name: 'MangaEdit',
    component: () => import('../views/MangaEdit.vue'),
  },
  {
    path: '/manga/edit',
    name: 'MangaAdd',
    component: () => import('../views/MangaEdit.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
