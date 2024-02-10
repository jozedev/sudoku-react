import { type APIResponse } from '../types'

const API = 'https://sudoku-api.vercel.app/api/dosuku'

export async function getBoard () {
  const response = await fetch(API)
  const data: APIResponse = await response.json()

  if (response.ok) {
    const newboard = data?.newboard
    return { board: transformBoard(newboard.grids[0].value), solution: transformBoard(newboard.grids[0].solution) }
  } else {
    const error = new Error('unknown')
    return await Promise.reject(error)
  }
}

function transformBoard (origBoard: number[][]) {
  const squares: number[][] = Array(9).fill(Array(9).fill(null))
  return squares.map((array, bigSquareIdx) => {
    return array.map((_, squareIdx) => {
      return origBoard[Math.floor(bigSquareIdx / 3) * 3 + Math.floor(squareIdx / 3)][3 * (bigSquareIdx % 3) + squareIdx % 3]
    })
  })
}
