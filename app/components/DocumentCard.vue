<script setup lang="ts">
const props = defineProps<{
  label: string
  expiryDate: string
  daysRemaining: number
  status: 'expired' | 'soon' | 'safe'
  color: string
}>()

// Format tanggal kedaluwarsa menjadi format yang rapi dibaca (contoh: 29 May 2026)
const formattedExpiry = computed(() => {
  return new Date(props.expiryDate + 'T00:00:00Z').toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
})

// Teks status kustom berdasarkan kondisi daysRemaining dari store dokumen
const statusText = computed(() => {
  if (props.status === 'expired') return 'Expired'
  if (props.status === 'soon') return `${props.daysRemaining} Days Left`
  return 'Active'
})

// Pemetaan kelas Tailwind berdasarkan token warna tema Anda untuk konsistensi UI
const badgeClasses = computed(() => {
  if (props.status === 'expired') return 'bg-danger/10 text-danger border-danger/20'
  if (props.status === 'soon') return 'bg-warning/10 text-warning border-warning/20'
  return 'bg-success/10 text-success border-success/20'
})
</script>

<template>
  <div class="flex items-center justify-between p-4 bg-surface rounded-card border border-slate-100 shadow-sm transition hover:border-slate-200">
    <div class="flex flex-col gap-1 pr-2">
      <h3 class="text-sm font-semibold text-navy line-clamp-1 leading-snug">
        {{ label }}
      </h3>
      <p class="font-data text-xs text-text-secondary tracking-wide">
        Expires: {{ formattedExpiry }}
      </p>
    </div>

    <span 
      class="text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 text-center min-w-[90px]"
      :class="badgeClasses"
    >
      {{ statusText }}
    </span>
  </div>
</template>