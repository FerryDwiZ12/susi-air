import { defineStore } from 'pinia'

/**
 * Auth mock. Token disimpan di cookie supaya bertahan saat reload / SSR.
 * Cukup untuk demo: login apa saja diterima.
 */
export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', { default: () => null })
  const pilotName = useCookie<string | null>('auth_pilot', { default: () => null })

  const isLoggedIn = computed(() => !!token.value)

  function login(name: string) {
    token.value = 'mock-token'
    pilotName.value = name || 'Pilot'
  }

  function logout() {
    token.value = null
    pilotName.value = null
  }

  return { token, pilotName, isLoggedIn, login, logout }
})