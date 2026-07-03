<script setup lang="ts">
// 💡 Hubungkan ke Schedule Store pusat
const scheduleStore = useScheduleStore();

// Pastikan data di-fetch jika halaman logbook diakses langsung
await useAsyncData("logbook-store-data", async () => {
  if (!scheduleStore.schedules.length) {
    await scheduleStore.fetchAll();
  }
  return true;
});

// 💡 Ambil hanya jadwal yang SUDAH memiliki logbook (Terverifikasi)
const verifiedLogs = computed(() => {
  return scheduleStore.schedules
    .filter(s => s.count_logbooks > 0) // Hanya ambil yang sudah di-log
    .map(s => ({
      id: s.id,
      flightNo: `SA-21${s.id.slice(-2)}`, // Generate nomor penerbangan tiruan konsisten
      route: "HLP (Jakarta) ➔ CJN (Pangandaran)", // Rute default dari spesifikasi
      date: new Date(s.duty_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
      duration: `${(s.count_logbooks * 1.2).toFixed(1)}h`, // Simulasi durasi block hours dinamis
      aircraft: "Cessna Grand Caravan - PK-ASI",
      status: s.status
    }));
});

// 💡 Hitung Agregat Total Jam Kerja Dinamis dari Logbook Riil
const totalBlockHours = computed(() => {
  return scheduleStore.schedules.reduce((acc, curr) => acc + (curr.count_logbooks * 1.2), 0).toFixed(1);
});

// Total sektor yang berhasil diselesaikan
const totalSectors = computed(() => {
  return scheduleStore.schedules.reduce((acc, curr) => acc + curr.count_logbooks, 0);
});
</script>

<template>
  <div class="space-y-5 animate-fadeIn">
    <div class="px-1">
      <h1 class="text-lg font-bold text-navy tracking-tight">Flight Logbook</h1>
      <p class="text-xs text-text-secondary mt-0.5">Historical overview of verified block times and airframes.</p>
    </div>

    <div class="bg-navy text-white p-5 rounded-card shadow-md relative overflow-hidden">
      <div class="absolute -right-6 -bottom-6 text-white/5 text-7xl font-bold font-data select-none pointer-events-none">
        LOGS
      </div>
      <span class="text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold tracking-wider">
        Current Period Rekap
      </span>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span class="text-[10px] block text-slate-400 font-semibold uppercase">Total Block Hours</span>
          <span class="font-data text-2xl font-bold mt-0.5 block">{{ totalBlockHours }}h</span>
        </div>
        <div class="border-l border-white/10 pl-4">
          <span class="text-[10px] block text-slate-400 font-semibold uppercase">Total Sectors</span>
          <span class="font-data text-2xl font-bold mt-0.5 block">{{ totalSectors }} Sectors</span>
        </div>
      </div>
    </div>

    <div class="space-y-2.5">
      <h2 class="text-xs font-bold text-navy uppercase tracking-wider px-1">Recent Sectors</h2>
      
      <div v-if="verifiedLogs.length" class="space-y-2.5">
        <div 
          v-for="log in verifiedLogs" 
          :key="log.id" 
          class="bg-surface p-4 rounded-card border border-slate-100 shadow-subtle flex justify-between items-center transition active:scale-[0.99]"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-[10px] bg-slate-100 text-navy px-1.5 py-0.5 rounded font-mono font-bold">
                {{ log.flightNo }}
              </span>
              <span class="text-xs font-bold text-navy">{{ log.route }}</span>
            </div>
            <div class="text-[11px] text-text-secondary flex items-center gap-2">
              <span>{{ log.date }}</span>
              <span>•</span>
              <span class="font-medium text-slate-500">{{ log.aircraft }}</span>
            </div>
          </div>
          
          <div class="text-right flex flex-col justify-center items-end pl-2">
            <span class="font-data text-sm font-bold text-navy">{{ log.duration }}</span>
            <span 
              class="text-[9px] font-bold px-2 py-0.5 rounded-full mt-1"
              :class="log.status === 2 ? 'text-success bg-success/10' : 'text-warning bg-warning/10'"
            >
              {{ log.status === 2 ? 'Verified' : 'Pending Review' }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8 text-xs text-slate-400 italic">
        No flight sectors logged in this current duty cycle.
      </div>
    </div>
  </div>
</template>