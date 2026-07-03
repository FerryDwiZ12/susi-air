<script setup lang="ts">
definePageMeta({ layout: "auth" });

const auth = useAuthStore();
const name = ref("");
const password = ref("");
const error = ref("");

function onSubmit() {
  if (!name.value.trim()) {
    error.value = "Enter your pilot name to continue.";
    return;
  }
  if (!password.value) {
    error.value = "Please enter your flight operations password.";
    return;
  }
  error.value = "";
  auth.login(name.value.trim());
  navigateTo("/home");
}
</script>

<template>
  <div class="w-full px-2">
    <div class="mb-6 text-center flex flex-col items-center">
      <img 
        src="https://susiair.com/images/susiair-logo.png" 
        alt="Susi Air Logo" 
        class="h-10 object-contain mb-3"
      />
      <h1 class="text-lg font-bold text-navy tracking-tight">Flight Operations Portal</h1>
      <p class="mt-1 text-xs text-text-secondary max-w-xs leading-relaxed">
        Sign in to manage your flight logs, regulatory limits, and upcoming rosters.
      </p>
    </div>

    <div class="rounded-card bg-surface border border-slate-100 p-6 shadow-subtle space-y-4">
      <div>
        <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
          Pilot Name
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </span>
          <input
            v-model="name"
            type="text"
            placeholder="John Doe"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-navy placeholder-slate-400 outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/10 font-medium"
            @keyup.enter="onSubmit"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 13.5h13.5a2.25 2.25 0 0 0 2.25-2.25V11.25a2.25 2.25 0 0 0-2.25-2.25H5.25a2.25 2.25 0 0 0-2.25 2.25v11.25A2.25 2.25 0 0 0 5.25 24Z" />
            </svg>
          </span>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-navy placeholder-slate-400 outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/10 font-medium"
            @keyup.enter="onSubmit"
          />
        </div>
      </div>

      <div v-if="error" class="flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/20 px-3 py-2 text-xs text-danger font-medium animate-fadeIn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 flex-shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <button
        class="w-full rounded-pill bg-brand py-3 text-sm font-bold text-white shadow-sm transition transform active:scale-[0.98] hover:opacity-95 cursor-pointer mt-2"
        @click="onSubmit"
      >
        Sign In
      </button>

      <div class="pt-3 text-center border-t border-slate-100 flex items-center justify-center gap-1 text-xs text-text-secondary">
        <span>Need help?</span>
        <a href="#" class="text-brand font-bold hover:underline transition">
          Contact CRD
        </a>
      </div>
    </div>
  </div>
</template>