import { createClient } from '@supabase/supabase-js'

// Supabase credentials (anon key is safe for frontend)
const supabaseUrl = 'https://sphtqakrgjowpabrylos.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaHRxYWtyZ2pvd3BhYnJ5bG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTk1MTUsImV4cCI6MjA4MzQ5NTUxNX0.YlGIGNg5gWbY11shU6-JfouhslECqIOLsBQMzQ_HJHE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = true

export type LeadStatus = 'novo' | 'aguardando_resposta' | 'em_atendimento' | 'ganho' | 'perdido'

export interface Lead {
  id: string
  nome: string
  telefone: string
  interesse: string
  status: LeadStatus
  origem: string
  mensagem_enviada: boolean
  respondeu: boolean
  created_at: string
  updated_at: string
}

export interface LeadsStats {
  total: number
  novos: number
  aguardando: number
  responderam: number
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }
  return (data || []) as Lead[]
}

export async function getLeadsStats(): Promise<LeadsStats> {
  const { data, error } = await supabase
    .from('leads')
    .select('status, respondeu')

  if (error) {
    console.error('Error fetching stats:', error)
    return { total: 0, novos: 0, aguardando: 0, responderam: 0 }
  }

  const leads = data || []
  return {
    total: leads.length,
    novos: leads.filter((l) => l.status === 'novo').length,
    aguardando: leads.filter((l) => l.status === 'aguardando_resposta').length,
    responderam: leads.filter((l) => l.respondeu).length,
  }
}
