import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, RefreshCw, Radio, Sparkles } from "lucide-react"

interface DashboardHeaderProps {
  isConnected: boolean
  onRefresh: () => void
}

export function DashboardHeader({ isConnected, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="glass-effect sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-success-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                CRM Corretor
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Gestão Inteligente de Leads Imobiliários
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`
                px-3 py-1.5 font-medium transition-all duration-300
                ${isConnected 
                  ? "bg-success/10 text-success border-success/30 realtime-pulse" 
                  : "bg-destructive/10 text-destructive border-destructive/30"
                }
              `}
            >
              <Radio className="h-3 w-3 mr-2" />
              {isConnected ? 'Realtime Ativo' : 'Desconectado'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={onRefresh}
              className="shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
