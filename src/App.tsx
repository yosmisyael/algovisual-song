import MusicPlayerInterface from './pages/Home.tsx'
import SearchSortPage from './pages/SearchSortPage.tsx' // pastikan path-nya benar
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MusicPlayerInterface />} />
                <Route path="/search-sort" element={<SearchSortPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;