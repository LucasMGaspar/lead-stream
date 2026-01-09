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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, XCircle, Phone } from "lucide-react"

interface LeadsTableProps {
  leads: Lead[]
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: { 
    label: 'Novo', 
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
  },
  aguardando_resposta: { 
    label: 'Aguardando', 
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20' 
  },
  em_atendimento: { 
    label: 'Em Atendimento', 
    className: 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80' 
  },
  ganho: { 
    label: 'Ganho', 
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
  },
  perdido: { 
    label: 'Perdido', 
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20' 
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
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Phone className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhum lead encontrado</p>
        <p className="text-sm">Os leads aparecerão aqui em tempo real</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Telefone</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Interesse</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold hidden lg:table-cell">Origem</TableHead>
            <TableHead className="font-semibold">Respondeu</TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead.id} 
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">{lead.nome}</TableCell>
              <TableCell className="font-mono text-sm">
                {formatPhoneNumber(lead.telefone)}
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                {lead.interesse}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={statusConfig[lead.status]?.className || ''}
                >
                  {statusConfig[lead.status]?.label || lead.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell capitalize">
                {lead.origem}
              </TableCell>
              <TableCell>
                {lead.respondeu ? (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Sim
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    <XCircle className="h-3 w-3 mr-1" />
                    Não
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
