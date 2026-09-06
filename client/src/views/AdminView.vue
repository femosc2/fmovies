<template>
  <div class="admin">
    <header>
      <h1>fmovies · admin</h1>
      <RouterLink class="back" to="/">← back to catalog</RouterLink>
    </header>

    <!-- Not signed in -->
    <div v-if="!auth.isSignedIn" class="gate">
      <p>Sign in to manage the catalog.</p>
      <button @click="auth.signInWithGoogle()">Sign in with Google</button>
    </div>

    <!-- Signed in but not an admin -->
    <div v-else-if="!auth.isAdmin" class="gate">
      <p>You're signed in as {{ auth.user?.email }}, which isn't an admin account.</p>
      <button @click="auth.logout()">Sign out</button>
    </div>

    <!-- Admin -->
    <div v-else>
      <div class="who">
        Signed in as {{ auth.user?.email }}
        <button class="link" @click="auth.logout()">Sign out</button>
      </div>
      <UploadForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import UploadForm from '@/components/Admin/UploadForm.vue';

const auth = useAuthStore();
</script>

<style scoped>
.admin {
  min-height: 100vh;
  padding: 24px;
  color: #fff;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  max-width: 640px;
  margin: 0 auto 24px;
}
.back {
  color: #42b983;
  text-decoration: none;
}
.gate {
  text-align: center;
  margin-top: 15vh;
}
.gate button {
  font-size: 16px;
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  background: #42b983;
  color: #fff;
  cursor: pointer;
}
.who {
  max-width: 640px;
  margin: 0 auto 12px;
  font-size: 14px;
  opacity: 0.8;
}
.link {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
  text-decoration: underline;
}
</style>
