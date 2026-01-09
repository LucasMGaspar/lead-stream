import { useEffect, useState, useCallback } from "react"
import { supabase, getLeads, getLeadsStats, Lead, LeadsStats, isSupabaseConfigured } from "@/lib/supabase"
import { DashboardHeader } from "@/components/DashboardHeader"
import { StatsCard } from "@/components/StatsCard"
import { LeadsTable } from "@/components/LeadsTable"
import { LeadsFilter } from "@/components/LeadsFilter"
import { Users, TrendingUp, Clock, CheckCircle2, Radio, Loader2, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Index() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadsStats>({ total: 0, novos: 0, aguardando: 0, responderam: 0 })
  const [statusFilter, setStatusFilter] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [leadsData, statsData] = await Promise.all([
        getLeads(),
        getLeadsStats()
      ])
      setLeads(leadsData)
      setStats(statsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    if (!supabase) return

    // Configura Realtime
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('🔥 Mudança detectada:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            setLeads(prev => [payload.new as Lead, ...prev])
          }

          if (payload.eventType === 'UPDATE') {
            setLeads(prev =>
              prev.map(lead =>
                lead.id === (payload.new as Lead).id
                  ? payload.new as Lead
                  : lead
              )
            )
          }

          if (payload.eventType === 'DELETE') {
            setLeads(prev =>
              prev.filter(lead => lead.id !== (payload.old as Lead).id)
            )
          }

          // Atualiza stats
          getLeadsStats().then(setStats)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime conectado!')
          setIsConnected(true)
        } else {
          setIsConnected(false)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadData])

  const filteredLeads = statusFilter === 'todos'
    ? leads
    : leads.filter(lead => lead.status === statusFilter)

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Configuração Necessária</h2>
            <p className="text-muted-foreground mb-4">
              Configure as variáveis de ambiente do Supabase para conectar ao banco de dados.
            </p>
            <code className="block bg-muted p-3 rounded-lg text-sm text-left">
              VITE_SUPABASE_URL<br/>
              VITE_SUPABASE_ANON_KEY
            </code>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader isConnected={isConnected} onRefresh={loadData} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Leads"
            value={stats.total}
            description="Todos os leads"
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Novos"
            value={stats.novos}
            description="Não contatados"
            icon={TrendingUp}
            variant="primary"
          />
          <StatsCard
            title="Aguardando"
            value={stats.aguardando}
            description="Sem resposta"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Responderam"
            value={stats.responderam}
            description="Em atendimento"
            icon={CheckCircle2}
            variant="success"
          />
        </section>

        {/* Filter & Table */}
        <section className="space-y-4">
          <LeadsFilter
            value={statusFilter}
            onChange={setStatusFilter}
            totalCount={filteredLeads.length}
          />
          <LeadsTable leads={filteredLeads} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Radio className="h-3 w-3 text-success realtime-pulse" />
            <span>Atualização em tempo real • Instantâneo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
