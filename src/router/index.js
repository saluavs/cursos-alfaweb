import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: {
      name: "Login",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/registro",
    name: "Registro",
    component: () => import("../views/Registro.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      requiredAuth: true,
    },
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/administracion",
    name: "Administracion",
    meta: {
      requiredAuth: true,
    },
    component: () => import("../views/Administracion.vue"),
  },
  {
    path: "/edicion/:id",
    props: true,
    name: "Edicion",
    meta: {
      requiredAuth: true,
    },
    component: () => import("../views/Edicion.vue"),
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let user = store.getters.enviandoUser;
  let requiredAuth = to.matched.some((res) => res.meta.requiredAuth);

  if (!user && requiredAuth) {
    next({
      name: "Login",
    });
  } else if (user && !requiredAuth) {
    next();
  } else {
    next();
  }
});

export default router;