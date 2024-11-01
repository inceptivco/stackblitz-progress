'use client'

import { Feature, useProjectStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Plus, GripVertical, X } from 'lucide-react'
import { useState } from 'react'

type TaskListProps = {
  projectId: string
  feature: Feature
}

export default function TaskList({ projectId, feature }: TaskListProps) {
  const [newTaskName, setNewTaskName] = useState('')
  const { addTask, updateTask, deleteTask, reorderTasks } = useProjectStore()

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(projectId, feature.id, {
        name: newTaskName.trim(),
        completion: 0,
      })
      setNewTaskName('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button onClick={handleAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {feature.tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-center gap-4 group"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString())
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const startIndex = parseInt(e.dataTransfer.getData('text/plain'))
              reorderTasks(projectId, feature.id, startIndex, index)
            }}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <Input
              value={task.name}
              onChange={(e) =>
                updateTask(projectId, feature.id, task.id, {
                  name: e.target.value,
                })
              }
            />
            <div className="w-48">
              <Slider
                value={[task.completion]}
                onValueChange={([value]) =>
                  updateTask(projectId, feature.id, task.id, {
                    completion: value,
                  })
                }
                max={100}
                step={1}
              />
            </div>
            <span className="w-12 text-sm text-muted-foreground">
              {task.completion}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
              onClick={() => deleteTask(projectId, feature.id, task.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}