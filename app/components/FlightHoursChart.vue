<script setup lang="ts">
interface Point {
  date: string
  value: number
  isFuture: boolean
}

const props = defineProps<{
  series: Point[]
  limit: number
  max: number
  today: string
}>()

// Mengatur Dimensi Canvas SVG agar Proporsional
const W = 380
const H = 220
const padL = 46 // Ruang di kiri diperlebar agar angka sumbu Y (sampai ribuan seperti 1250h) tidak terpotong
const padR = 15
const padT = 25
const padB = 35
const innerW = W - padL - padR
const innerH = H - padT - padB

// Sesuai Spec Section C: Sumbu Y-max (Maksimum Grafik) wajib mengikuti prop max dari tipe toggle
const maxY = computed(() => props.max || 45)

function x(i: number): number {
  const n = props.series.length
  return n <= 1 ? padL : padL + (i / (n - 1)) * innerW
}

function y(v: number): number {
  // Ditambahkan Math.min agar jika data melambung melebih Y-Max, garis tidak keluar dari area gambar SVG
  return padT + innerH - (Math.min(v, maxY.value) / maxY.value) * innerH
}

/**
 * FIX SEKSI B & C: MENAMPILKAN SUMBU Y YANG HILANG
 * Membuat 4 titik interval garis pandu horizontal dan label teks angka jam penerbangan (0h hingga Y-Max)
 */
const yAxisTicks = computed(() => {
  const ticks = []
  const count = 4
  for (let i = 0; i < count; i++) {
    const val = (maxY.value / (count - 1)) * i
    ticks.push({
      yPos: y(val),
      label: `${Math.round(val)}h`
    })
  }
  return ticks
})

/**
 * FIX SEKSI B & D: MENAMPILKAN LABEL SUMBU X BERBASIS RENTANG ±7 HARI SECARA BERSIH
 * Mengambil sampel 4 titik label dari total 15 titik agar tidak menumpuk di perangkat mobile
 */
const xAxisTicks = computed(() => {
  const n = props.series.length
  if (n < 2) return []
  
  const ticksCount = 4 
  const ticks = []
  
  for (let i = 0; i < ticksCount; i++) {
    const idx = Math.round((i / (ticksCount - 1)) * (n - 1))
    if (props.series[idx]) {
      ticks.push({
        xPos: x(idx),
        label: formatXLabel(props.series[idx].date)
      })
    }
  }
  return ticks
})

// Format label tanggal sumbu X menjadi format yang bersih (Contoh: "12 May")
function formatXLabel(isoString: string): string {
  const date = new Date(isoString + 'T00:00:00Z')
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

// Jalur Matematika Grafik Batang Garis SVG (Line & Area Fill Path)
const pastPoints = computed(() => props.series.filter(p => !p.isFuture))
const futurePoints = computed(() => props.series.filter(p => p.isFuture || p.date === props.today))

const pastPath = computed(() => {
  if (!pastPoints.value.length) return ''
  return pastPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(props.series.indexOf(p)).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
})

const futurePath = computed(() => {
  if (futurePoints.value.length <= 1) return ''
  return futurePoints.value.map((p, i) => {
    const origIdx = props.series.findIndex(sp => sp.date === p.date)
    return `${i === 0 ? 'M' : 'L'} ${x(origIdx).toFixed(1)} ${y(p.value).toFixed(1)}`
  }).join(' ')
})

const areaPath = computed(() => {
  if (!props.series.length) return ''
  const baseY = y(0).toFixed(1)
  const lineL = props.series.map((p, i) => `L ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
  return `M ${x(0).toFixed(1)} ${baseY} ${lineL} L ${x(props.series.length - 1).toFixed(1)} ${baseY} Z`
})

const lineColor = '#22C5E8' // Menggunakan token warna Chart Accent Anda
</script>

<template>
  <div class="w-full overflow-visible bg-surface">
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full overflow-visible">
      
      <g class="select-none">
        <g v-for="(tick, idx) in yAxisTicks" :key="'y-' + idx">
          <line 
            :x1="padL" 
            :y1="tick.yPos" 
            :x2="W - padR" 
            :y2="tick.yPos" 
            stroke="#F1F5F9" 
            stroke-width="1" 
          />
          <text 
            :x="padL - 8" 
            :y="tick.yPos + 4" 
            text-anchor="end" 
            fill="#94A3B8" 
            class="text-[10px] font-semibold font-data"
          >
            {{ tick.label }}
          </text>
        </g>
      </g>

      <path :d="areaPath" :fill="lineColor" fill-opacity="0.06" />

      <g v-if="limit <= maxY">
        <line 
          :x1="padL" 
          :y1="y(limit)" 
          :x2="W - padR" 
          :y2="y(limit)" 
          stroke="#E63757" 
          stroke-width="1.25" 
          stroke-dasharray="4 3" 
        />
        <text 
          :x="W - padR - 4" 
          :y="y(limit) - 4" 
          text-anchor="end" 
          fill="#E63757" 
          class="text-[9px] font-bold font-data shadow-sm"
        >
          LIMIT: {{ limit }}h
        </text>
      </g>

      <path :d="pastPath" fill="none" :stroke="lineColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      <path v-if="futurePath" :d="futurePath" fill="none" :stroke="lineColor" stroke-width="2" stroke-linejoin="round" stroke-dasharray="3 3" opacity="0.6" />

      <g v-if="series.length">
        <circle 
          invisible-fallback
          :cx="x(series.findIndex(p => p.date === today))" 
          :cy="y(series.find(p => p.date === today)?.value ?? 0)" 
          r="4" 
          :fill="lineColor" 
          stroke="#FFFFFF" 
          stroke-width="1.5" 
        />
      </g>

      <g class="select-none">
        <text
          v-for="(tick, idx) in xAxisTicks"
          :key="'x-' + idx"
          :x="tick.xPos"
          :y="H - padB + 16"
          text-anchor="middle"
          fill="#94A3B8"
          class="text-[10px] font-semibold font-data"
        >
          {{ tick.label }}
        </text>
      </g>

      <line :x1="padL" :y1="y(0)" :x2="W - padR" :y2="y(0)" stroke="#E2E8F0" stroke-width="1" />
    </svg>
  </div>
</template>