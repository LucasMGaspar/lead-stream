import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

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
  if (!isSupabaseConfigured) {
    console.warn('Supabase não configurado')
    return []
  }
  
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
  if (!isSupabaseConfigured) {
    return { total: 0, novos: 0, aguardando: 0, responderam: 0 }
  }
  
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
