import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ChevronDown, ChevronRight, Plus, Trash2, ListTodo } from 'lucide-react'
import { type Priorite, type Tache } from './types'


const priorityConfig: Record<Priorite, { label: string; className: string }> = {
  bas: { label: 'Faible', className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  moyen: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
  haut: { label: 'Élevé', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

function genererId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function App() {
  const [taches, setTaches] = useState<Tache[]>([
    {
      id: genererId(),
      titre: 'Configurer le projet',
      completee: true,
      priorite: 'haut',
      afficherSousTaches: false,
      sousTaches: [
        { id: genererId(), titre: 'Installer les dépendances', completee: true },
        { id: genererId(), titre: 'Configurer shadcn', completee: true },
      ],
    },
    {
      id: genererId(),
      titre: 'Construire l\'interface',
      completee: false,
      priorite: 'moyen',
      afficherSousTaches: true,
      sousTaches: [
        { id: genererId(), titre: 'Créer les composants', completee: false },
        { id: genererId(), titre: 'Ajouter les styles', completee: false },
      ],
    },
  ])

  const [titreNouvelleTache, setTitreNouvelleTache] = useState('')
  const [prioriteNouvelleTache, setPrioriteNouvelleTache] = useState<Priorite>('moyen')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [titresNouvellesSousTaches, setTitresNouvellesSousTaches] = useState<Record<string, string>>({})

  // TODO : Utiliser Immer
  function ajouterTache() {
    if (!titreNouvelleTache.trim()) return
    setTaches(prev => [
      ...prev,
      {
        id: genererId(),
        titre: titreNouvelleTache.trim(),
        completee: false,
        priorite: prioriteNouvelleTache,
        afficherSousTaches: false,
        sousTaches: [],
      },
    ])
    setTitreNouvelleTache('')
    setPrioriteNouvelleTache('moyen')
    setDialogOpen(false)
  }

  // TODO : Utiliser Immer
  function basculerTache(taskId: string) {
    setTaches(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completee: !t.completee } : t))
    )
  }

  // TODO : Utiliser Immer
  function supprimerTache(taskId: string) {
    setTaches(prev => prev.filter(t => t.id !== taskId))
  }

  // TODO : Utiliser Immer
  function basculerAffichageSousTaches(taskId: string) {
    setTaches(prev =>
      prev.map(t => (t.id === taskId ? { ...t, afficherSousTaches: !t.afficherSousTaches } : t))
    )
  }

  // TODO : Utiliser Immer
  function ajoutSousTache(taskId: string) {
    const titre = titresNouvellesSousTaches[taskId]?.trim()
    if (!titre) return
    setTaches(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, sousTaches: [...t.sousTaches, { id: genererId(), titre: titre, completee: false }] }
          : t
      )
    )
    setTitresNouvellesSousTaches(prev => ({ ...prev, [taskId]: '' }))
  }

  // TODO : Utiliser Immer
  function basculerSousTache(taskId: string, subtaskId: string) {
    setTaches(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              sousTaches: t.sousTaches.map(s =>
                s.id === subtaskId ? { ...s, completee: !s.completee } : s
              ),
            }
          : t
      )
    )
  }

  // TODO : Utiliser Immer
  function supprimerSousTache(taskId: string, subtaskId: string) {
    setTaches(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, sousTaches: t.sousTaches.filter(s => s.id !== subtaskId) }
          : t
      )
    )
  }

  const nombreCompletees = taches.filter(t => t.completee).length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListTodo className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Mes tâches</h1>
              <p className="text-sm text-muted-foreground">
                {nombreCompletees} / {taches.length} terminées
              </p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une tâche</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Input
                  placeholder="Titre de la tâche..."
                  value={titreNouvelleTache}
                  onChange={e => setTitreNouvelleTache(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && ajouterTache()}
                  autoFocus
                />
                <div className="flex gap-2">
                  {(['bas', 'moyen', 'haut'] as Priorite[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPrioriteNouvelleTache(p)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all border-2 ${
                        prioriteNouvelleTache === p ? 'border-primary' : 'border-transparent'
                      } ${priorityConfig[p].className}`}
                    >
                      {priorityConfig[p].label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={ajouterTache} disabled={!titreNouvelleTache.trim()}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {taches.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucune tâche. Créez-en une pour commencer.
              </CardContent>
            </Card>
          )}
          {taches.map(task => {
            const completedSubtasks = task.sousTaches.filter(s => s.completee).length
            return (
              <Card key={task.id} className={task.completee ? 'opacity-60' : ''}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completee}
                      onCheckedChange={() => basculerTache(task.id)}
                    />
                    <CardTitle
                      className={`flex-1 text-base font-medium ${task.completee ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.titre}
                    </CardTitle>
                    <Badge className={`text-xs ${priorityConfig[task.priorite].className}`}>
                      {priorityConfig[task.priorite].label}
                    </Badge>
                    {task.sousTaches.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {completedSubtasks}/{task.sousTaches.length}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => basculerAffichageSousTaches(task.id)}
                    >
                      {task.afficherSousTaches ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => supprimerTache(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {task.afficherSousTaches && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <Separator className="mb-3" />
                    <div className="space-y-2 pl-7">
                      {task.sousTaches.map(subtask => (
                        <div key={subtask.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={subtask.completee}
                            onCheckedChange={() => basculerSousTache(task.id, subtask.id)}
                          />
                          <span
                            className={`flex-1 text-sm ${subtask.completee ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {subtask.titre}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => supprimerSousTache(task.id, subtask.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-1">
                        <Input
                          placeholder="Ajouter une sous-tâche..."
                          className="h-8 text-sm"
                          value={titresNouvellesSousTaches[task.id] ?? ''}
                          onChange={e =>
                            setTitresNouvellesSousTaches(prev => ({ ...prev, [task.id]: e.target.value }))
                          }
                          onKeyDown={e => e.key === 'Enter' && ajoutSousTache(task.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => ajoutSousTache(task.id)}
                          disabled={!titresNouvellesSousTaches[task.id]?.trim()}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
