"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "A volunteer statistics pie chart"

interface VolunteerData {
  status: string
  count: number
  fill: string
}

interface VolunteerPieChartProps {
  approvedCount: number
  waitlistedCount: number
  pendingCount: number
  rejectedCount: number
}

const getVolunteerData = (
  approved: number,
  waitlisted: number,
  pending: number,
  rejected: number
): VolunteerData[] => [
  { status: "approved", count: approved, fill: "rgb(0, 0, 0)" },
  { status: "waitlisted", count: waitlisted, fill: "rgba(0, 0, 0, 0.8)" },
  { status: "pending", count: pending, fill: "rgba(0, 0, 0, 0.6)" },
  { status: "rejected", count: rejected, fill: "rgba(0, 0, 0, 0.4)" },
]

const chartConfig = {
  approved: {
    label: "Approved",
    color: "rgb(0, 0, 0)",
  },
  waitlisted: {
    label: "Waitlisted",
    color: "rgba(0, 0, 0, 0.8)",
  },
  pending: {
    label: "Pending",
    color: "rgba(0, 0, 0, 0.6)",
  },
  rejected: {
    label: "Rejected",
    color: "rgba(0, 0, 0, 0.4)",
  },
} satisfies ChartConfig

export function VolunteerPieChart({ 
  approvedCount, 
  waitlistedCount, 
  pendingCount, 
  rejectedCount 
}: VolunteerPieChartProps) {
  const id = "volunteer-pie-chart"
  const [activeStatus, setActiveStatus] = React.useState("approved")

  const volunteerData = React.useMemo(
    () => getVolunteerData(approvedCount, waitlistedCount, pendingCount, rejectedCount),
    [approvedCount, waitlistedCount, pendingCount, rejectedCount]
  )

  const activeIndex = React.useMemo(
    () => volunteerData.findIndex((item) => item.status === activeStatus),
    [activeStatus, volunteerData]
  )

  const statuses = React.useMemo(() => volunteerData.map((item) => item.status), [volunteerData])
  const totalVolunteers = React.useMemo(
    () => volunteerData.reduce((sum, item) => sum + item.count, 0),
    [volunteerData]
  )

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Volunteer Statistics</CardTitle>
          <CardDescription>Application Status Overview</CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a status"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {statuses.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                                     <div className="flex items-center gap-2 text-xs">
                     <span
                       className="flex h-3 w-3 shrink-0 rounded-xs"
                       style={{
                         backgroundColor: config?.color,
                       }}
                     />
                     {config?.label}
                   </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={volunteerData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVolunteers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Volunteers
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
