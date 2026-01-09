import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LeadsFilterProps {
  value: string
  onChange: (value: string) => void
  totalCount: number
}

export function LeadsFilter({ value, onChange, totalCount }: LeadsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Seus Leads</h2>
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? 'encontrado' : 'encontrados'}
        </p>
      </div>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="novo">Novos</SelectItem>
          <SelectItem value="aguardando_resposta">Aguardando</SelectItem>
          <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
          <SelectItem value="ganho">Ganhos</SelectItem>
          <SelectItem value="perdido">Perdidos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
