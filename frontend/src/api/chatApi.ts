import { axiosClient } from './axiosClient'

export interface ChatSession {
  id: number
  title: string
  createdAt: string
  lastActive: string
  messageCount: number
}

export interface ChatMessage {
  id: number
  sessionId: number
  role: 'USER' | 'ASSISTANT'
  content: string
  disclaimer?: string
  createdAt: string
}

export interface SendMessageRequest {
  sessionId?: number
  message: string
  currentAqi?: number
  city?: string
}

export interface AqiExplanation {
  term: string
  fullName: string
  meaning: string
  primarySources: string
  healthImpact: string
  safeThreshold: string
  protectionActions: string[]
  scientificCitation: string
}

export const chatApi = {
  sendMessage: async (data: SendMessageRequest) => {
    const res = await axiosClient.post<{ data: ChatMessage }>('/ai/chat', data)
    return res.data.data
  },

  getSessions: async () => {
    const res = await axiosClient.get<{ data: ChatSession[] }>('/ai/chat/sessions')
    return res.data.data
  },

  createSession: async (title?: string) => {
    const res = await axiosClient.post<{ data: ChatSession }>('/ai/chat/sessions', null, {
      params: { title },
    })
    return res.data.data
  },

  getSessionMessages: async (sessionId: number) => {
    const res = await axiosClient.get<{ data: ChatMessage[] }>(`/ai/chat/sessions/${sessionId}/messages`)
    return res.data.data
  },

  deleteSession: async (sessionId: number) => {
    const res = await axiosClient.delete(`/ai/chat/sessions/${sessionId}`)
    return res.data
  },

  explainTerm: async (term: string) => {
    const res = await axiosClient.get<{ data: AqiExplanation }>('/ai/explain', {
      params: { term },
    })
    return res.data.data
  },

  generateIndoorPlan: async () => {
    const res = await axiosClient.post<{ data: string }>('/ai/indoor-plan')
    return res.data.data
  },

  generateFamilyPlan: async (aqi: number = 285) => {
    const res = await axiosClient.post<{ data: string }>('/ai/family-recommendations', null, {
      params: { aqi },
    })
    return res.data.data
  },
}
