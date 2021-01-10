import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import define from "../views/Define.vue";
import results from "../views/Results.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "define",
    component: define,
  },
  {
    path: "/results",
    name: "results",
    component: results,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
