import { createRouter, createWebHistory } from "vue-router";
import QRGenerator from "../components/QRGenerator.vue";
import QRScanner from "../components/QRScanner.vue";

const routes = [
  {
    path: "/",
    redirect: "/generator",
  },
  {
    path: "/generator",
    name: "Generator",
    component: QRGenerator,
    meta: {
      title: "QR Code Generator",
    },
  },
  {
    path: "/scanner",
    name: "Scanner",
    component: QRScanner,
    meta: {
      title: "QR Code Scanner",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "QR Code App";
  next();
});

export default router;
