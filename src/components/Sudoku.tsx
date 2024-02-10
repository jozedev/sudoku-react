import { BigSquare } from './BigSquare'
import { SudokuContext } from '../context/sudoku'
import { useContext, useEffect, useRef } from 'react'

export function Sudoku () {
  const { loading, hasWon, timer, initNewBoard, values, registerValue, showHint } = useContext(SudokuContext)
  const refMain = useRef<HTMLElement>(null)

  function handleKeydown (e: React.KeyboardEvent) {
    if (e.key === '1') registerValue(1)
    if (e.key === '2') registerValue(2)
    if (e.key === '3') registerValue(3)
    if (e.key === '4') registerValue(4)
    if (e.key === '5') registerValue(5)
    if (e.key === '6') registerValue(6)
    if (e.key === '7') registerValue(7)
    if (e.key === '8') registerValue(8)
    if (e.key === '9') registerValue(9)
    if (e.key === '0' || e.key === 'Delete' || e.key === 'Backspace') registerValue(0)
  }

  useEffect(() => {
    if (refMain.current != null) {
      refMain.current.focus()
    }
  }, [])

  function formatTimer () {
    return `${Math.floor(timer / 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}:${(timer % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}`
  }

  return (
    <main ref={refMain} onKeyDown={handleKeydown} tabIndex={-1}>
      <button onClick={() => { initNewBoard() }}>Get New Board!</button>
      <span className='timer'>{formatTimer()}</span>
      <button onClick={() => { showHint() }}>Show Hint!</button>
      <hr />
      <div className='buttons-sudoku-container'>
        {
          Array.from({ length: 9 }, (_, i) => i + 1).concat(0).map((val) => (
            <button onClick={() => { registerValue(val) }} key={val}>{val !== 0 ? val : '_'}</button>
          ))
        }
      </div>
      <hr />
      <div className="container" >
        <div className="sudoku-container">
          <div className='grid'>
            {
              values.map((bigSquare, i) => (
                <BigSquare values={bigSquare} idx={i} key={i} />
              ))
            }
          </div>
        </div>
        {
          loading && <div className='loader-container'>
            <div className='loader'></div>
          </div>
        }
        {
          hasWon && <div className='loader-container'>
            <div className='win-message-container'>
              <h3 className='win-message'>YOU WIN!!</h3>
            </div>
          </div>
        }
      </div>
    </main>
  )
}
