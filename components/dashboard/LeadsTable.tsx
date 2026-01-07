import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { SimpleLead } from "@/types"

interface LeadsTableProps {
  leads: SimpleLead[]
  leadsCount: number
}

export function LeadsTable({ leads, leadsCount }: LeadsTableProps) {
  const getStatusColor = (status: SimpleLead['status']) => {
    switch (status) {
      case 'in progress':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      case 'new':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'qualified':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatStatus = (status: SimpleLead['status']) =>
    status
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const activityLabels = [
    'Today at 9:24 AM',
    'Today at 8:10 AM',
    'Yesterday at 6:45 PM',
    'Sep 12, 2025',
    'Sep 11, 2025'
  ]

  const getLastActivityLabel = (index: number) => activityLabels[index % activityLabels.length]

  const displayedLeads = leads.slice(0, 2)

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Recent Leads</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {leadsCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y border-t border-border md:hidden">
          {displayedLeads.map((lead, index) => (
            <div key={lead.id} className="flex flex-col gap-4 px-4 py-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                  <AvatarFallback className="text-xs font-medium">
                    {getInitials(lead.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{lead.contact}</span>
                      <span className="text-muted-foreground/70">•</span>
                      <span>{getLastActivityLabel(index)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(lead.status)} px-2 py-1 text-[11px]`}
                    >
                      {formatStatus(lead.status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedLeads.map((lead, index) => (
                  <tr key={lead.id} className="border-b border-border transition-colors hover:bg-muted/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(lead.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-foreground">{lead.contact}</span>
                        <span className="text-xs text-muted-foreground">{getLastActivityLabel(index)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(lead.status)}
                      >
                        {formatStatus(lead.status)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-sm text-primary hover:text-primary">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="default" size="sm">
          <Link href="/deals">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}