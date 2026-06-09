export type Priorite = 'bas' | 'moyen' | 'haut'

export interface SousTache {
  id: string
  titre: string
  completee: boolean
}

export interface Tache {
  id: string
  titre: string
  completee: boolean
  priorite: Priorite
  afficherSousTaches: boolean
  sousTaches: SousTache[]
}