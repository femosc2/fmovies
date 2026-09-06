import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
    },
    {
      // Deep link to a movie — renders the same catalog view (gallery behind) and
      // opens the detail modal for the matching title slug.
      path: '/movie/:slug',
      name: 'movie',
      component: () => import('@/views/CatalogView.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/StatisticsView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAdmin: true },
    },
  ],
});

// The /admin view is always allowed to render — it gates its own content on auth state
// (sign-in button -> not-authorized -> upload form). We only wait for the first auth state
// so the view paints the correct step immediately instead of flashing the sign-in button.
// Sign-in itself happens on a real button click inside AdminView (browsers block popups that
// aren't triggered by a user gesture, which is why the guard must NOT open the popup).
router.beforeEach(async (to) => {
  if (to.meta.requiresAdmin) {
    await useAuthStore().ready();
  }
  return true;
});

export default router;
