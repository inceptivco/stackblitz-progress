'use client'

import { useProjectStore } from '@/lib/store'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import FeatureList from '@/components/FeatureList'
import ProjectProgress from '@/components/ProjectProgress'
import CreateFeatureDialog from '@/components/CreateFeatureDialog'
import { useTheme } from 'next-themes'

export default function ProjectPage() {
  const params = useParams()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.slug === params.slug)
  )

  if (!project) {
    return <div>Project not found</div>
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: project.color }}>
          {project.name}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        </div>
      </div>

      <ProjectProgress project={project} />
      
      <div className="mt-8">
        <FeatureList project={project} />
      </div>

      <CreateFeatureDialog
        projectId={project.id}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
}