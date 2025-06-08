import MusicPlayerInterface from './pages/Home.tsx'
import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<MusicPlayerInterface />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
