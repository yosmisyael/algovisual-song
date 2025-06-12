import {BarChart3, Home, SearchIcon} from "lucide-react";
import {useState} from "react";

const Navbar = ({ onSearch }: { onSearch?: (term: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Trigger search on every keystroke
        if (onSearch) {
            onSearch(value.trim());
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() && onSearch) {
            onSearch(searchTerm.trim());
        }
    };

    return (
        <div className="flex items-center justify-between py-2 bg-black/10 backdrop-blur-sm px-6">
            <div className="flex items-center justify-between gap-2">
                <img src="/logo.png" alt="application logo" className="h-10"/>
                <h1 className="font-black text-3xl bg-gradient-to-br from-purple-300 via-violet-600 to-teal-500 bg-clip-text text-transparent">Qilabloxtify</h1>
            </div>
            <div className="flex items-center space-x-4">
                <a href="/" className="hover:cursor-pointer">
                    <Home/>
                </a>
                <div className={`flex items-center bg-black/20 rounded-full px-8 py-4 space-x-2 transition-all ${isSearchActive ? 'ring-2 ring-purple-500' : ''}`}>
                    <SearchIcon className="w-4 h-4" />
                    <form onSubmit={handleSearch} className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={handleInputChange} // Changed this line
                            onFocus={() => setIsSearchActive(true)}
                            onBlur={() => setIsSearchActive(false)}
                            className="bg-transparent border-none outline-none text-white placeholder-white/50 w-48"
                        />
                    </form>
                    <div className="w-px h-4 bg-white/20" />
                    <a href="search-sort" className="hover:cursor-pointer flex gap-2 bg-black/20 py-2 px-2 rounded-xl">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Sort</span>
                    </a>
                </div>
            </div>
            <div className="text-transparent select-none">something hidden here</div>
        </div>
    );
};

export default Navbar;