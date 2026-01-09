import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, Radio } from "lucide-react"

interface DashboardHeaderProps {
  isConnected: boolean
  onRefresh: () => void
}

export function DashboardHeader({ isConnected, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CRM Corretor</h1>
              <p className="text-sm text-muted-foreground">
                Gestão de Leads para Corretores
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={
                isConnected 
                  ? "bg-success/10 text-success border-success/30 realtime-pulse" 
                  : "bg-destructive/10 text-destructive border-destructive/30"
              }
            >
              <Radio className="h-3 w-3 mr-1.5" />
              {isConnected ? 'Realtime Ativo' : 'Desconectado'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={onRefresh}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
