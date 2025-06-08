import { BarChart3, Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // tambahkan ini

const SearchSortBar = () => {
    const navigate = useNavigate(); // inisialisasi navigator

    const handleSearchClick = () => {
        navigate("/search-sort"); // arahkan ke halaman SearchSortPage
    };

    const handleHomeClick = () => {
        navigate("/");
    };

    return (
        <div className="flex items-center justify-between py-2 bg-black/10 backdrop-blur-sm">
            <div></div>
            <div className="flex items-center space-x-4">
                {/* Tombol Home yang bisa diklik */}
                <button
                    onClick={handleHomeClick}
                    className="text-white hover:text-purple-400 transition"
                >
                    <Home className="w-6 h-6" />
                </button>
                <div
                    className="flex items-center bg-black/20 rounded-full px-8 py-4 space-x-2 cursor-pointer"
                    onClick={handleSearchClick} // trigger navigasi
                >
                    <Search className="w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-white placeholder-white/50 cursor-pointer"
                        readOnly // agar tidak bisa diketik, bisa diubah nanti
                    />
                    <div className="w-px h-4 bg-white/20" />
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Sort</span>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default SearchSortBar;