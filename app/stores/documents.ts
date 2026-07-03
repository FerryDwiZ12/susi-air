import { defineStore } from 'pinia'
import {
  getExpiryStatus,
  type ExpiryResult,
} from '~/composables/useExpiryStatus'

export interface DocItem {
  id: string
  label: string
  expiryDate: string
}

export interface DecoratedDoc extends DocItem, ExpiryResult {}

interface Thresholds {
  warningDays: number
  comment?: string
}

interface DocumentsResponse {
  today: string
  thresholds: Thresholds
  documents: DocItem[]
}

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    today: '',
    warningDays: 30,
    documents: [] as DocItem[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /** Dokumen + daysRemaining/status/color siap render. */
    decorated(state): DecoratedDoc[] {
      return state.documents.map((d) => ({
        ...d,
        ...getExpiryStatus(d.expiryDate, state.today, state.warningDays),
      }))
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<DocumentsResponse>('/api/documents')
        this.today = data.today
        this.warningDays = data.thresholds?.warningDays ?? 30
        this.documents = data.documents
      } catch (e) {
        this.error =
          e instanceof Error ? e.message : 'Failed to load documents'
      } finally {
        this.loading = false
      }
    },
  },
})