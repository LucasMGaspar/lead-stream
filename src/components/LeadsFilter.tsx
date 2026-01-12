import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, LayoutGrid, List } from "lucide-react"

interface LeadsFilterProps {
  value: string
  onChange: (value: string) => void
  totalCount: number
}

export function LeadsFilter({ value, onChange, totalCount }: LeadsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 glass-effect rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Seus Leads</h2>
          <p className="text-sm text-muted-foreground font-medium">
            <span className="text-primary font-bold">{totalCount}</span> {totalCount === 1 ? 'lead encontrado' : 'leads encontrados'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-card shadow-sm">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-border/50 bg-card shadow-sm font-medium">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="todos" className="rounded-lg">Todos os Status</SelectItem>
            <SelectItem value="novo" className="rounded-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Novos
              </div>
            </SelectItem>
            <SelectItem value="aguardando_resposta" className="rounded-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                Aguardando
              </div>
            </SelectItem>
            <SelectItem value="em_atendimento" className="rounded-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-info" />
                Em Atendimento
              </div>
            </SelectItem>
            <SelectItem value="ganho" className="rounded-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Ganhos
              </div>
            </SelectItem>
            <SelectItem value="perdido" className="rounded-lg">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Perdidos
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
