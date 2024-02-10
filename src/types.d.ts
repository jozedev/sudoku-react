export interface APIResponse {
  newboard: Newboard
}

export interface Newboard {
  grids: Grid[]
  results: number
  message: string
}

export interface Grid {
  value: number[][]
  solution: number[][]
  difficulty: string
}
