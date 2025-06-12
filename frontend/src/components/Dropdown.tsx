import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type {GenericDropdownProps} from "../types/DropdownProp.ts";

type AudioMode = 'volume' | 'equalizer';

const CustomDropdown = ({
    options,
    value,
    onChange,
}: GenericDropdownProps<AudioMode>) => {
    const selectedOption = options.find(opt => opt.value === value);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const targetNode = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(targetNode)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionSelect = (value: AudioMode) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex px-4 py-2 gap-x-2 items-center bg-black/20 rounded-2xl backdrop-blur-sm border-2 border-slate-300 hover:bg-black/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-w-[140px]"
            >
                <span className="font-semibold text-white/90 text-base flex-1 text-left capitalize">
            {selectedOption!.value}
          </span>
                <ChevronDown
                    className={`w-5 h-5 text-white/70 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm border-2 border-slate-300 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionSelect(option.value as AudioMode)}
                            className={`w-full px-4 py-3 text-left font-semibold text-base transition-all duration-200 hover:bg-white/10 focus:outline-none focus:bg-white/10 capitalize ${
                                value === option.value
                                    ? 'text-white bg-white/10'
                                    : 'text-white/90'
                            }`}
                        >
                            {option!.value}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;