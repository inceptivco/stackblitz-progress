'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProjectStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import CreateProjectDialog from '@/components/CreateProjectDialog'

export default function ProjectsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const projects = useProjectStore((state) => state.projects)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}