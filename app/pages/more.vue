<script setup lang="ts">
import { useAuthStore } from '~/stores/auth' // Asumsi nama store auth Anda
// 💡 1. Import dan panggil Schedule Store yang menyimpan nama pilot
import { useScheduleStore } from '~/stores/schedule' 

const auth = useAuthStore();
const scheduleStore = useScheduleStore(); // Picu store jadwal

function handleLogout() {
  auth.logout();
  navigateTo("/");
}

const menuItems = [
  { label: "Company Operations Manual (COM)", icon: "LucideBookOpen", desc: "Susi Air regulatory flying procedures" },
  { label: "Safety Management System (SMS)", icon: "LucideShieldCheck", desc: "Report hazards & read safety bulletins" },
  { label: "Crew Resource Department (CRD)", icon: "LucidePhone", desc: "Contact roster planners & standby desk" },
  { label: "Application Settings", icon: "LucideSettings", desc: "Manage notifications & offline parameters" },
];
</script>

<template>
  <div class="space-y-5 animate-fadeIn">
    <div class="px-1">
      <h1 class="text-lg font-bold text-navy tracking-tight">More Options</h1>
      <p class="text-xs text-text-secondary mt-0.5">Access operational manuals, contact support, and account controls.</p>
    </div>

    <div class="bg-surface rounded-card border border-slate-100 p-4 shadow-subtle flex items-center gap-4">
      <div class="w-14 h-14 rounded-full border border-slate-100 overflow-hidden bg-slate-50 shadow-sm flex-shrink-0">
        <img 
          src="/images/pilot-avatar.webp" 
          alt="Pilot Avatar" 
          class="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 class="text-base font-bold text-navy leading-tight">
          {{ scheduleStore?.pilotName || 'None' }}
        </h2>
        
        <span class="text-[11px] font-mono font-semibold text-text-secondary block mt-0.5">
          License: ATPL No. 4932 / Class 1 Medical
        </span>
        <span class="inline-flex items-center gap-1 text-[10px] font-bold text-success mt-1">
          <span class="w-1.5 h-1.5 bg-success rounded-full animate-ping"></span>
          Active Duty Status
        </span>
      </div>
    </div>

    <div class="bg-surface border border-slate-100 rounded-card shadow-subtle divide-y divide-slate-50 overflow-hidden">
      <div 
        v-for="item in menuItems" 
        :key="item.label"
        class="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer active:bg-slate-100"
      >
        <div class="flex items-center gap-3.5 pr-2">
          <component 
            :is="item.icon" 
            :size="20" 
            :stroke-width="1.75" 
            class="text-navy flex-shrink-0" 
          />
          <div>
            <h3 class="text-xs font-bold text-navy leading-tight">{{ item.label }}</h3>
            <p class="text-[11px] text-text-secondary mt-0.5">{{ item.desc }}</p>
          </div>
        </div>
        <LucideChevronRight :size="16" :stroke-width="2" class="text-slate-300 flex-shrink-0" />
      </div>
    </div>

    <div class="pt-2 px-1">
      <button 
        @click="handleLogout"
        class="w-full bg-brand text-white text-sm font-bold py-3.5 rounded-pill shadow-sm transition transform active:scale-[0.98] hover:opacity-95 cursor-pointer flex items-center justify-center gap-2"
      >
        <LucideLogOut :size="16" :stroke-width="2" />
        <span>End Flight Duty (Sign Out)</span>
      </button>
      <div class="text-center text-[10px] text-slate-400 font-medium mt-4 font-mono">
        Susi Air Ops App v2.6.0 (Build 2026.07)
      </div>
    </div>
  </div>
</template>