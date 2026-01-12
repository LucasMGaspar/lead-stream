import { Lead, LeadStatus } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, XCircle, Phone, User, Calendar, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeadsTableProps {
  leads: Lead[]
}

const statusConfig: Record<LeadStatus, { label: string; className: string; dotClass: string }> = {
  novo: { 
    label: 'Novo', 
    className: 'bg-primary/10 text-primary border-primary/30 font-semibold',
    dotClass: 'bg-primary'
  },
  aguardando_resposta: { 
    label: 'Aguardando', 
    className: 'bg-warning/10 text-warning border-warning/30 font-semibold',
    dotClass: 'bg-warning'
  },
  em_atendimento: { 
    label: 'Em Atendimento', 
    className: 'bg-info/10 text-info border-info/30 font-semibold',
    dotClass: 'bg-info'
  },
  ganho: { 
    label: 'Ganho', 
    className: 'bg-success/10 text-success border-success/30 font-semibold',
    dotClass: 'bg-success'
  },
  perdido: { 
    label: 'Perdido', 
    className: 'bg-destructive/10 text-destructive border-destructive/30 font-semibold',
    dotClass: 'bg-destructive'
  },
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 text-muted-foreground border-dashed">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <Phone className="h-10 w-10 opacity-40" />
        </div>
        <p className="text-xl font-semibold text-foreground mb-2">Nenhum lead encontrado</p>
        <p className="text-sm">Os leads aparecerão aqui automaticamente em tempo real</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden shadow-soft border-border/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
              <TableHead className="font-bold text-foreground py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Telefone
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground hidden md:table-cell">Interesse</TableHead>
              <TableHead className="font-bold text-foreground">Status</TableHead>
              <TableHead className="font-bold text-foreground hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Origem
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground">Respondeu</TableHead>
              <TableHead className="font-bold text-foreground hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Data
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <TableRow 
                key={lead.id} 
                className={cn(
                  "transition-all duration-200 hover:bg-muted/40 group animate-in",
                  index === 0 && "bg-primary/5"
                )}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <TableCell className="font-semibold py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                      {lead.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="group-hover:text-primary transition-colors">
                      {lead.nome}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {formatPhoneNumber(lead.telefone)}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px]">
                  <span className="text-sm text-muted-foreground truncate block">
                    {lead.interesse}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "gap-1.5",
                      statusConfig[lead.status]?.className || ''
                    )}
                  >
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      statusConfig[lead.status]?.dotClass
                    )} />
                    {statusConfig[lead.status]?.label || lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="capitalize text-sm font-medium bg-muted/50 px-2.5 py-1 rounded-md">
                    {lead.origem}
                  </span>
                </TableCell>
                <TableCell>
                  {lead.respondeu ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Sim
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />
                      Não
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground/80">
                      {format(new Date(lead.created_at), "dd MMM", { locale: ptBR })}
                    </span>
                    <span className="text-xs">
                      {format(new Date(lead.created_at), "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
