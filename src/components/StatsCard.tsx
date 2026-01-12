import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  variant?: 'default' | 'primary' | 'success' | 'warning'
  className?: string
}

const variantStyles = {
  default: {
    card: 'bg-card border-border hover:border-border/80',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  primary: {
    card: 'bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-primary/20 hover:border-primary/40',
    icon: 'gradient-primary text-primary-foreground shadow-glow-primary',
    value: 'text-primary',
  },
  success: {
    card: 'bg-gradient-to-br from-success/8 via-success/3 to-transparent border-success/20 hover:border-success/40',
    icon: 'gradient-success text-success-foreground',
    value: 'text-success',
  },
  warning: {
    card: 'bg-gradient-to-br from-warning/8 via-warning/3 to-transparent border-warning/20 hover:border-warning/40',
    icon: 'gradient-warning text-warning-foreground',
    value: 'text-warning',
  },
}

export function StatsCard({ title, value, description, icon: Icon, variant = 'default', className }: StatsCardProps) {
  const styles = variantStyles[variant]
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 group",
      styles.card,
      className
    )}>
      {/* Decorative gradient blur */}
      {variant !== 'default' && (
        <div className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-30",
          variant === 'primary' && "bg-primary",
          variant === 'success' && "bg-success",
          variant === 'warning' && "bg-warning",
        )} />
      )}
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className={cn(
              "text-4xl font-extrabold tracking-tight tabular-nums",
              styles.value
            )}>
              {value.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              {description}
            </p>
          </div>
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
            styles.icon
          )}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
