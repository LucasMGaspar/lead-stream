import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

const variantStyles = {
  default: 'bg-card text-card-foreground border-border',
  primary: 'bg-primary/5 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
}

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
}

export function StatsCard({ title, value, description, icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      variantStyles[variant]
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            iconStyles[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
