import MusicPlayerInterface from './pages/Home.tsx'
import SearchSort from './pages/SearchSort.tsx'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MusicPlayerInterface />} />
                <Route path="/search-sort" element={<SearchSort />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;