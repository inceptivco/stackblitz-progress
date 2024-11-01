'use client'

import { Project } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TaskList from '@/components/TaskList'
import { Progress } from '@/components/ui/progress'

type FeatureListProps = {
  project: Project
}

export default function FeatureList({ project }: FeatureListProps) {
  return (
    <div className="space-y-6">
      {project.features.map((feature) => {
        const completionPercentage =
          feature.tasks.length > 0
            ? feature.tasks.reduce((acc, task) => acc + task.completion, 0) /
              feature.tasks.length
            : 0

        return (
          <Card key={feature.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{feature.name}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentage)}%
                </span>
              </CardTitle>
              <Progress value={completionPercentage} className="h-2" />
            </CardHeader>
            <CardContent>
              <TaskList projectId={project.id} feature={feature} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}