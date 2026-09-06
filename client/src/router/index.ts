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
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAdmin: true },
    },
  ],
});

// Route guard is UX only — it prompts sign-in and hides the admin UI from non-admins. The real
// security boundary is the serverless function, which verifies the ID token + allowlist itself.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) return true;

  const authStore = useAuthStore();
  await authStore.ready();

  if (!authStore.isSignedIn) {
    try {
      await authStore.signInWithGoogle();
    } catch {
      return { path: '/' };
    }
  }
  // Let AdminView render the "not authorized" state for signed-in non-admins.
  return true;
});

export default router;
