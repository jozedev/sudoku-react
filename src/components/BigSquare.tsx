import { useContext } from 'react'
import { Square } from './Square'
import { SudokuContext } from '../context/sudoku'

interface Props {
  values: number[]
  idx: number
}

export function BigSquare ({ values, idx }: Props) {
  const { updateBigSquareSelected } = useContext(SudokuContext)

  function handleOnClick () {
    updateBigSquareSelected(idx)
  }

  return (
    <div onClick={handleOnClick} className={'grid'}>
      {
        values.map((square, j) => (
          <Square key={j} value={square} idx={j} idxBigSquare={idx} />
        ))
      }
    </div>
  )
}
