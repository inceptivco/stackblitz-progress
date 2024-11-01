'use client'

import { Project, useProjectStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const deleteProject = useProjectStore((state) => state.deleteProject)

  return (
    <Card className="relative" style={{ borderColor: project.color }}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{project.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => deleteProject(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>Start: {format(new Date(project.startDate), 'PP')}</div>
          <div>End: {format(new Date(project.endDate), 'PP')}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.slug}`} className="w-full">
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}