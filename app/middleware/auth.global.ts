/**
 * Semua route kecuali '/' (sign in) butuh login.
 * Tidak ada loop: '/' selalu diizinkan; route lain -> redirect ke '/'.
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (to.path === "/") return;
  if (!auth.isLoggedIn) return navigateTo("/");
});
