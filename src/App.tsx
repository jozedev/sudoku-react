import './App.css'
import { Sudoku } from './components/Sudoku'
import { SudokuProvider } from './context/sudoku'

function App () {
  return (
    <>
      <h1>Sudoku</h1>
      <SudokuProvider>
        <Sudoku />
      </SudokuProvider>
      <hr />
      <p>This game cosumes the following <a href='https://sudoku-api.vercel.app/' target="_blank" rel="noreferrer">API</a></p>
    </>
  )
}

export default App
