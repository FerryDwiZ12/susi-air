<template>
  <header class="flex items-center justify-between py-4 border-b border-slate-100 bg-white px-1">
    <div class="flex items-center gap-2">
      <img
        src="https://susiair.com/images/susiair-logo.png"
        alt="Susi Air Logo"
        class="h-8 object-contain"
      />
    </div>

    <div class="flex items-center gap-3">
      <button
        class="relative p-1.5 text-navy hover:bg-slate-50 rounded-full transition-colors duration-200"
      >
        <LucideBell :size="22" :stroke-width="1.75" class="text-navy" />

        <span
          class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse"
        ></span>
      </button>

      <div
        class="w-8 h-8 rounded-full bg-slate-200 border border-slate-100 overflow-hidden flex items-center justify-center"
      >
        <span class="text-xs font-bold text-navy">JD</span>
      </div>
    </div>
  </header>
</template>