<script setup lang="ts">
const auth = useAuthStore();

// Jalur koordinat vektor (path) dari Heroicons v2 Outline resmi
const nav = [
  { 
    label: "Home", 
    to: "/home", 
    iconPath: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" 
  },
  { 
    label: "Schedule", 
    to: "/schedule", 
    iconPath: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" 
  },
  { 
    label: "Logbook", 
    to: "/logbook", // <-- Ubah dari "#" atau "/" menjadi "/logbook"
    iconPath: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
  },
  { 
    label: "More", 
    to: "/more", // <-- Ubah dari "#" atau "/" menjadi "/more"
    iconPath: "M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
  }
];

function signOut() {
  auth.logout();
  navigateTo("/");
}
</script>

<template>
  <div class="min-h-screen bg-bg pb-20">
    <main class="mx-auto max-w-md px-4 py-4">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md border-t border-slate-100 bg-white/95 backdrop-blur shadow-md flex justify-around items-center h-16 px-4">
  <NuxtLink
    v-for="item in nav"
    :key="item.label"
    :to="item.to"
    class="flex flex-col items-center justify-center flex-1 text-[10px] font-bold text-text-secondary py-1.5 px-2 rounded-xl transition-all duration-200 ease-in-out transform active:scale-95 gap-0.5 mx-1"
    active-class="bg-navy/5 text-navy font-extrabold"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="1.75" 
      stroke="currentColor" 
      class="w-5 h-5 transition-transform duration-200"
      :class="{'stroke-[2.25] scale-105': $route.path === item.to}"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="item.iconPath" />
    </svg>
    <span>{{ item.label }}</span>
  </NuxtLink>
</nav>
  </div>
</template>
