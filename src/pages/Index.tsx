import { useEffect, useState, useCallback } from "react"
import { supabase, getLeads, getLeadsStats, Lead, LeadsStats } from "@/lib/supabase"
import { DashboardHeader } from "@/components/DashboardHeader"
import { StatsCard } from "@/components/StatsCard"
import { LeadsTable } from "@/components/LeadsTable"
import { LeadsFilter } from "@/components/LeadsFilter"
import { Users, TrendingUp, Clock, CheckCircle2, Radio, Loader2 } from "lucide-react"

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


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <DashboardHeader isConnected={isConnected} onRefresh={loadData} />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total de Leads"
            value={stats.total}
            description="Todos os leads cadastrados"
            icon={Users}
            variant="default"
            className="animate-in stagger-1"
          />
          <StatsCard
            title="Novos"
            value={stats.novos}
            description="Aguardando primeiro contato"
            icon={TrendingUp}
            variant="primary"
            className="animate-in stagger-2"
          />
          <StatsCard
            title="Aguardando"
            value={stats.aguardando}
            description="Pendente de resposta"
            icon={Clock}
            variant="warning"
            className="animate-in stagger-3"
          />
          <StatsCard
            title="Responderam"
            value={stats.responderam}
            description="Leads engajados"
            icon={CheckCircle2}
            variant="success"
            className="animate-in stagger-4"
          />
        </section>

        {/* Filter & Table */}
        <section className="space-y-5 animate-in" style={{ animationDelay: '0.25s' }}>
          <LeadsFilter
            value={statusFilter}
            onChange={setStatusFilter}
            totalCount={filteredLeads.length}
          />
          <LeadsTable leads={filteredLeads} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <Radio className="h-3 w-3 text-success realtime-pulse" />
                <span className="font-medium text-success">Realtime Ativo</span>
              </div>
              <span>•</span>
              <span>Atualizações instantâneas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CRM Corretor • Gestão Inteligente de Leads
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
