'use client'

import { Project } from '@/lib/store'
import { Progress } from '@/components/ui/progress'
import { differenceInDays } from 'date-fns'

type ProjectProgressProps = {
  project: Project
}

export default function ProjectProgress({ project }: ProjectProgressProps) {
  const totalTasks = project.features.reduce(
    (acc, feature) => acc + feature.tasks.length,
    0
  )
  
  const completedPercentage = totalTasks
    ? project.features.reduce(
        (acc, feature) =>
          acc +
          feature.tasks.reduce((sum, task) => sum + task.completion, 0) /
            totalTasks,
        0
      )
    : 0

  const startDate = new Date(project.startDate)
  const endDate = new Date(project.endDate)
  const today = new Date()
  
  const totalDays = differenceInDays(endDate, startDate)
  const daysElapsed = differenceInDays(today, startDate)
  const timeProgress = Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Overall Progress</span>
        <span className="text-sm text-muted-foreground">
          {Math.round(completedPercentage)}%
        </span>
      </div>
      <div className="relative">
        <Progress value={completedPercentage} className="h-2" />
        <div
          className="absolute top-0 w-0.5 h-2 bg-foreground"
          style={{ left: `${timeProgress}%` }}
        />
      </div>
    </div>
  )
}