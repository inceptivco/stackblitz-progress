import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import slugify from 'slugify'

export type Task = {
  id: string
  name: string
  completion: number
}

export type Feature = {
  id: string
  name: string
  tasks: Task[]
}

export type Project = {
  id: string
  name: string
  slug: string
  startDate: string
  endDate: string
  color: string
  features: Feature[]
}

type ProjectStore = {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'slug' | 'features'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  addFeature: (projectId: string, feature: Omit<Feature, 'id' | 'tasks'>) => void
  updateFeature: (projectId: string, featureId: string, feature: Partial<Feature>) => void
  deleteFeature: (projectId: string, featureId: string) => void
  addTask: (projectId: string, featureId: string, task: Omit<Task, 'id'>) => void
  updateTask: (projectId: string, featureId: string, taskId: string, task: Partial<Task>) => void
  deleteTask: (projectId: string, featureId: string, taskId: string) => void
  reorderTasks: (projectId: string, featureId: string, startIndex: number, endIndex: number) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => {
          const projectExists = state.projects.some(
            (p) => p.name.toLowerCase() === project.name.toLowerCase()
          )
          if (projectExists) {
            throw new Error('Project with this name already exists')
          }
          return {
            projects: [
              ...state.projects,
              {
                ...project,
                id: crypto.randomUUID(),
                slug: slugify(project.name.toLowerCase()),
                features: [],
              },
            ],
          }
        }),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      addFeature: (projectId, feature) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: [
                    ...p.features,
                    { ...feature, id: crypto.randomUUID(), tasks: [] },
                  ],
                }
              : p
          ),
        })),
      updateFeature: (projectId, featureId, feature) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.map((f) =>
                    f.id === featureId ? { ...f, ...feature } : f
                  ),
                }
              : p
          ),
        })),
      deleteFeature: (projectId, featureId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.filter((f) => f.id !== featureId),
                }
              : p
          ),
        })),
      addTask: (projectId, featureId, task) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.map((f) =>
                    f.id === featureId
                      ? {
                          ...f,
                          tasks: [...f.tasks, { ...task, id: crypto.randomUUID() }],
                        }
                      : f
                  ),
                }
              : p
          ),
        })),
      updateTask: (projectId, featureId, taskId, task) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.map((f) =>
                    f.id === featureId
                      ? {
                          ...f,
                          tasks: f.tasks.map((t) =>
                            t.id === taskId ? { ...t, ...task } : t
                          ),
                        }
                      : f
                  ),
                }
              : p
          ),
        })),
      deleteTask: (projectId, featureId, taskId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.map((f) =>
                    f.id === featureId
                      ? {
                          ...f,
                          tasks: f.tasks.filter((t) => t.id !== taskId),
                        }
                      : f
                  ),
                }
              : p
          ),
        })),
      reorderTasks: (projectId, featureId, startIndex, endIndex) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  features: p.features.map((f) =>
                    f.id === featureId
                      ? {
                          ...f,
                          tasks: Array.from(f.tasks).sort((a, b) => {
                            if (a.id === f.tasks[startIndex].id) return endIndex - startIndex
                            if (b.id === f.tasks[startIndex].id) return startIndex - endIndex
                            return 0
                          }),
                        }
                      : f
                  ),
                }
              : p
          ),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
)