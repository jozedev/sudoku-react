import { createContext, useEffect, useRef, useState } from 'react'
import { getBoard } from '../services/sudoku'
import { arrays } from '../helpers/arrays'

const INIT_VAL: number[][] = Array(9).fill(Array(9).fill(0))
const INIT_EDIT: boolean[][] = Array(9).fill(Array(9).fill(false))

interface Props {
  children: React.ReactNode
}

export const SudokuContext = createContext({
  loading: false,
  hasWon: false,
  timer: 0,
  initNewBoard: () => { },
  values: INIT_VAL,
  squaresEditable: INIT_EDIT,
  squaresError: INIT_EDIT,
  registerValue: (newValue: number) => { },
  showHint: () => { },
  squareSelected: -1,
  updateSquareSelected: (idxSquare: number) => { },
  bigSquareSelected: -1,
  updateBigSquareSelected: (idxBigSquare: number) => { }
})

export function SudokuProvider ({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [hasWon, setHasWon] = useState<boolean>(false)
  const [values, setValues] = useState<number[][]>(INIT_VAL)
  const [squaresEditable, setSquaresEditable] = useState<boolean[][]>(INIT_EDIT)
  const [squaresError, setSquaresError] = useState<boolean[][]>(INIT_EDIT)
  const solution = useRef<number[][]>(INIT_VAL)
  const [squareSelected, setSquareSelected] = useState<number>(-1)
  const [bigSquareSelected, setBigSquareSelected] = useState<number>(-1)
  const [timer, setTimer] = useState(0)
  const timerInterval = useRef<number>(0)

  useEffect(initNewBoard, [])

  useEffect(() => {
    if (!loading) {
      timerInterval.current = setInterval(() => { setTimer((current) => current + 1) }, 1000)
    }
    return () => { clearInterval(timerInterval.current) }
  }, [loading])

  function initNewBoard () {
    setLoading(true)
    setBigSquareSelected(-1)
    setSquareSelected(-1)
    setHasWon(false)
    setSquaresError(INIT_EDIT)
    getBoard()
      .then(response => {
        setValues(response.board)
        setSquaresEditable(response.board.map((bigSquare => bigSquare.map(square => square === 0))))
        solution.current = response.solution
        setLoading(false)
        setTimer(0)
      })
      .catch(err => {
        console.error(err)
        setTimeout(() => {
          initNewBoard()
        }, 5000)
      })
  }

  function updateSquareSelected (idxSquare: number) {
    if (idxSquare < 9 && idxSquare >= 0) {
      setSquareSelected(idxSquare)
    }
  }

  function updateBigSquareSelected (idxBigSquare: number) {
    if (idxBigSquare < 9 && idxBigSquare >= 0) {
      setBigSquareSelected(idxBigSquare)
    }
  }

  function registerValue (newValue: number) {
    if (bigSquareSelected < 0 || squareSelected < 0) {
      console.log('You must select a square first')
      return
    }

    if (newValue < 0 || newValue > 9) {
      console.log('The new value must be valid')
      return
    }

    if (!squaresEditable[bigSquareSelected][squareSelected]) {
      console.log('Can\'t edit a square with a default value')
      return
    }

    setValues(current => {
      const matrixCopy = [...current]
      const arrayCopy = [...matrixCopy[bigSquareSelected]]
      arrayCopy[squareSelected] = newValue
      matrixCopy[bigSquareSelected] = arrayCopy

      return matrixCopy
    })
  }

  function showHint () {
    if (bigSquareSelected < 0 || squareSelected < 0) {
      console.log('You must select a square first')
      return
    }

    setValues(current => {
      const matrixCopy = [...current]
      const arrayCopy = [...matrixCopy[bigSquareSelected]]
      arrayCopy[squareSelected] = solution.current[bigSquareSelected][squareSelected]
      matrixCopy[bigSquareSelected] = arrayCopy

      return matrixCopy
    })

    setSquaresEditable(current => {
      const matrixCopy = [...current]
      const arrayCopy = [...matrixCopy[bigSquareSelected]]
      arrayCopy[squareSelected] = false
      matrixCopy[bigSquareSelected] = arrayCopy

      return matrixCopy
    })
  }

  // Update the square errors matrix
  useEffect(() => {
    if (bigSquareSelected === -1 || squareSelected === -1) return

    setSquaresError(_ => {
      // Find duplicates inside each 3x3 square
      const matrix = values.map((bigSquare) => {
        const duplicates = arrays.findAllDuplicates(bigSquare).filter(d => d.element !== 0)
        return bigSquare.map((_, idx) => duplicates.some(d => d.indexes.includes(idx)))
      })

      // Find duplicated values in rows
      const valuesRows = INIT_VAL.map((array, i) => {
        return array.map((_, j) => {
          return values[Math.floor(i / 3) * 3 + Math.floor(j / 3)][3 * (i % 3) + j % 3]
        })
      })
      const matrixDuplicatedRows = valuesRows.map((row) => {
        const duplicates = arrays.findAllDuplicates(row).filter(d => d.element !== 0)
        return row.map((_, idx) => duplicates.some(d => d.indexes.includes(idx)))
      })

      const matrix1 = INIT_EDIT.map((array, i) => {
        return array.map((_, j) => {
          return matrixDuplicatedRows[Math.floor(i / 3) * 3 + Math.floor(j / 3)][3 * (i % 3) + j % 3]
        })
      })

      // Find duplicated values in columns
      const valuesCols = INIT_VAL.map((array, i) => {
        return array.map((_, j) => {
          return values[Math.floor(j / 3) * 3 + Math.floor(i / 3)][3 * (j % 3) + i % 3]
        })
      })
      const matrixDuplicatedCols = valuesCols.map((col) => {
        const duplicates = arrays.findAllDuplicates(col).filter(d => d.element !== 0)
        return col.map((_, idx) => duplicates.some(d => d.indexes.includes(idx)))
      })

      const matrix2 = INIT_EDIT.map((array, i) => {
        return array.map((_, j) => {
          return matrixDuplicatedCols[3 * (i % 3) + j % 3][Math.floor(i / 3) * 3 + Math.floor(j / 3)]
        })
      })

      // Join all matrix
      return matrix.map((array, i) => {
        return array.map((val, j) => {
          return val || matrix1[i][j] || matrix2[i][j]
        })
      })
    })
  }, [values])

  // Check winning condition
  useEffect(() => {
    setHasWon(!arrays.areEqual(values, INIT_VAL) && arrays.areEqual(values, solution.current))
  }, [values])

  useEffect(() => {
    if (hasWon) clearInterval(timerInterval.current)
  }, [hasWon])

  return (
    <SudokuContext.Provider value={{ loading, hasWon, timer, initNewBoard, values, squaresEditable, squaresError, registerValue, showHint, squareSelected, updateSquareSelected, bigSquareSelected, updateBigSquareSelected }}>
      {children}
    </SudokuContext.Provider>
  )
}
