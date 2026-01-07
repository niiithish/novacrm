"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"
import type { PerformanceData } from "@/types"
import { KPICard } from "./KpiCard"
import {
  mockKPIData
} from "@/lib/data/mock-data"

interface PerformanceAreaChartProps {
  data: PerformanceData[]
  chartType: 'line' | 'bar'
  onChartTypeChange: (type: 'line' | 'bar') => void
}

type FilterType = 'all' | 'loanGenerated' | 'preapprovalLoan' | 'contacts' | 'inProcess' | 'loanClosed'

const chartColors = {
  // loanGenerated: { area: '#8b5cf6', stroke: '#7c3aed' },
  // preapprovalLoan: { area: '#3b82f6', stroke: '#2563eb' },
  contacts: { area: '#10b981', stroke: '#059669' },
  inProcess: { area: '#f59e0b', stroke: '#d97706' },
  loanClosed: { area: '#ef4444', stroke: '#dc2626' }
}

const filterOptions: { key: FilterType; label: string; color?: string }[] = [
  { key: 'all', label: 'All' },
  // { key: 'loanGenerated', label: 'Loan Generated', color: chartColors.loanGenerated.area },
  // { key: 'preapprovalLoan', label: 'Pre-approval Loan', color: chartColors.preapprovalLoan.area },
  { key: 'contacts', label: 'Contacts', color: chartColors.contacts.area },
  { key: 'inProcess', label: 'In Process', color: chartColors.inProcess.area },
  { key: 'loanClosed', label: 'Loan Closed', color: chartColors.loanClosed.area }
]

export function PerformanceAreaChart({ data, chartType, onChartTypeChange }: PerformanceAreaChartProps) {
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>(['all'])

  const handleFilterToggle = (key: FilterType) => {
    if (key === 'all') {
      setSelectedFilters(['all'])
      return
    }

    setSelectedFilters((prev) => {
      const withoutAll = prev.filter((item) => item !== 'all')
      const isActive = withoutAll.includes(key)
      const next = isActive
        ? withoutAll.filter((item) => item !== key)
        : [...withoutAll, key]

      return next.length ? next : ['all']
    })
  }

  const isAllSelected = selectedFilters.includes('all')
  const activeSpecificFilters = selectedFilters.filter((item) => item !== 'all') as Exclude<FilterType, 'all'>[]

  const isOptionActive = (key: FilterType) => {
    if (key === 'all') {
      return isAllSelected
    }

    return isAllSelected ? false : activeSpecificFilters.includes(key as Exclude<FilterType, 'all'>)
  }

  const shouldRenderSeries = (key: Exclude<FilterType, 'all'>) => {
    return isAllSelected || activeSpecificFilters.includes(key)
  }

  const isStackedMode = isAllSelected || activeSpecificFilters.length > 1
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length || label == null) {
      return null
    }

    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, index) => {
          if (!entry || entry.dataKey == null) {
            return null
          }

          const dataKey = String(entry.dataKey)
          const value = typeof entry.value === 'number' ? entry.value : Number(entry.value)

          if (Number.isNaN(value)) {
            return null
          }

          const labelMap: Record<string, string> = {
            loanGenerated: 'Loan Generated',
            preapprovalLoan: 'Pre-approval Loan',
            contacts: 'Contacts',
            inProcess: 'In Process',
            loanClosed: 'Loan Closed'
          }

          const formattedValue = ['contacts', 'inProcess', 'loanClosed'].includes(dataKey)
            ? formatNumber(value)
            : formatCurrency(value)

          return (
            <div key={`${dataKey}-${index}`} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {labelMap[dataKey] ?? dataKey}
              </span>
              <span className="font-medium ml-auto">
                {formattedValue}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* KPI Cards - Compact horizontal layout */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 flex-1">
              <KPICard
                title="Total Amount"
                value={mockKPIData.totalAmount}
                subtitle="USD"
                format="currency"
                currency="USD"
                trend={{ value: "12.5%", positive: true, label: "vs last month" }}
                className="flex-1"
              />
              <KPICard
                title="Total Deals"
                value={mockKPIData.totalDeals}
                format="number"
                trend={{ value: "8", positive: true, label: "vs last month" }}
                className="flex-1"
              />
              <KPICard
                title="Leads Count"
                value={mockKPIData.leadsCount}
                format="number"
                trend={{ value: "8", positive: true, label: "vs last month" }}
                className="flex-1"
              />
            </div>
          </div>

        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-2 pb-6 sm:px-6">
          {/* Combined Filter + Legend */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={isOptionActive(option.key) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterToggle(option.key)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {option.key === 'all' ? (
                      <span className="flex h-3 w-3 items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-foreground/70" />
                      </span>
                    ) : (
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
              {/* Chart Type Toggle */}
              <div className="flex justify-end gap-2">
                <Toggle
                  pressed={chartType === 'line'}
                  onPressedChange={() => onChartTypeChange('line')}
                  aria-label="Toggle line chart"
                  size="sm"
                >
                  Line
                </Toggle>
                <Toggle
                  pressed={chartType === 'bar'}
                  onPressedChange={() => onChartTypeChange('bar')}
                  aria-label="Toggle bar chart"
                  size="sm"
                >
                  Bar
                </Toggle>
              </div>
            </div>
          </div>
          <div className="h-80 w-full max-w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Conditional Area rendering based on filter */}
                  {/*{shouldRenderSeries('loanGenerated') && (
                    <Area
                      type="monotone"
                      dataKey="loanGenerated"
                      stackId={isStackedMode ? "1" : "single"}
                      stroke={chartColors.loanGenerated.stroke}
                      fill={chartColors.loanGenerated.area}
                      fillOpacity={0.6}
                    />
                  )}
                  {shouldRenderSeries('preapprovalLoan') && (
                    <Area
                      type="monotone"
                      dataKey="preapprovalLoan"
                      stackId={isStackedMode ? "1" : "single"}
                      stroke={chartColors.preapprovalLoan.stroke}
                      fill={chartColors.preapprovalLoan.area}
                      fillOpacity={0.6}
                    />
                  )} */}
                  {shouldRenderSeries('contacts') && (
                    <Area
                      type="monotone"
                      dataKey="contacts"
                      stackId={isStackedMode ? "2" : "single"}
                      stroke={chartColors.contacts.stroke}
                      fill={chartColors.contacts.area}
                      fillOpacity={0.6}
                    />
                  )}
                  {shouldRenderSeries('inProcess') && (
                    <Area
                      type="monotone"
                      dataKey="inProcess"
                      stackId={isStackedMode ? "2" : "single"}
                      stroke={chartColors.inProcess.stroke}
                      fill={chartColors.inProcess.area}
                      fillOpacity={0.6}
                    />
                  )}
                  {shouldRenderSeries('loanClosed') && (
                    <Area
                      type="monotone"
                      dataKey="loanClosed"
                      stackId={isStackedMode ? "2" : "single"}
                      stroke={chartColors.loanClosed.stroke}
                      fill={chartColors.loanClosed.area}
                      fillOpacity={0.6}
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Conditional Bar rendering based on filter */}
                  {/* {shouldRenderSeries('loanGenerated') && (
                    <Bar dataKey="loanGenerated" fill={chartColors.loanGenerated.area} radius={[2, 2, 0, 0]} />
                  )}
                  {shouldRenderSeries('preapprovalLoan') && (
                    <Bar dataKey="preapprovalLoan" fill={chartColors.preapprovalLoan.area} radius={[2, 2, 0, 0]} />
                  )} */}
                  {shouldRenderSeries('contacts') && (
                    <Bar dataKey="contacts" fill={chartColors.contacts.area} radius={[2, 2, 0, 0]} />
                  )}
                  {shouldRenderSeries('inProcess') && (
                    <Bar dataKey="inProcess" fill={chartColors.inProcess.area} radius={[2, 2, 0, 0]} />
                  )}
                  {shouldRenderSeries('loanClosed') && (
                    <Bar dataKey="loanClosed" fill={chartColors.loanClosed.area} radius={[2, 2, 0, 0]} />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}