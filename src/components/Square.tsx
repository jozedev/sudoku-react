import { useContext } from 'react'
import { SudokuContext } from '../context/sudoku'

interface Props {
  value: number
  idx: number
  idxBigSquare: number
}

export function Square ({ value, idx, idxBigSquare }: Props) {
  const { updateSquareSelected, bigSquareSelected, squareSelected, squaresEditable, squaresError } = useContext(SudokuContext)

  function handleOnClick () {
    updateSquareSelected(idx)
  }

  function isSelected () {
    return bigSquareSelected === idxBigSquare && squareSelected === idx
  }

  function hasError () {
    return squaresError[idxBigSquare][idx]
  }

  function isHighlighted () {
    const rows: number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

    const rowBigSquare = rows.find(row => row.includes(bigSquareSelected)) ?? []
    const rowSquare = rows.find(row => row.includes(squareSelected)) ?? []

    const cols: number[][] = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]

    const colBigSquare = cols.find(row => row.includes(bigSquareSelected)) ?? []
    const colSquare = cols.find(row => row.includes(squareSelected)) ?? []

    return bigSquareSelected === idxBigSquare || (rowBigSquare.includes(idxBigSquare) && rowSquare.includes(idx)) || (colBigSquare.includes(idxBigSquare) && colSquare.includes(idx))
  }

  function isEditable () {
    return squaresEditable[idxBigSquare][idx]
  }

  const classes = `square ${isHighlighted() ? 'highlighted' : ''} ${isEditable() ? 'editable' : ''} ${hasError() ? 'square-error' : ''} ${isSelected() ? 'selected' : ''}`

  return (
    <div onClick={handleOnClick} className={classes}>
      <p>{value !== 0 ? value : ''}</p>
    </div>
  )
}
