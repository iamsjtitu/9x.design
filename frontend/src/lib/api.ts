import axios from 'axios'

// Vite uses VITE_ prefix for env vars. Fallback to REACT_APP_BACKEND_URL for compat.
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.REACT_APP_BACKEND_URL ||
  ''

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

export type ContactPayload = {
  name: string
  email: string
  service: string
  message: string
  company?: string
  budget?: string
}

export async function submitContact(payload: ContactPayload) {
  const { data } = await api.post('/contact', payload)
  return data as { id: string; success: boolean; message: string }
}
