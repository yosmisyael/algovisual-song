import { Bell, BarChart3, Music, Settings } from 'lucide-react';

const Sidebar = () => {
    const sidebarItems = [
        { icon: Music, label: 'Playing' },
        { icon: Music, label: 'Playlist' },
        { icon: BarChart3, label: 'Charts' },
        { icon: Music, label: 'Library' }
    ];

    return (
        <div className="w-20 bg-black/20 backdrop-blur-sm flex flex-col items-center py-6 space-y-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <Music className="w-6 h-6 text-green-400" />
            </div>

            {sidebarItems.map((item, index) => (
                <div key={index} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <item.icon className="w-5 h-5" />
                </div>
            ))}

            <div className="flex-1" />

            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
            </div>

            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Settings className="w-5 h-5" />
            </div>

            <div className="w-12 h-12 bg-white rounded-full" />
        </div>
    );
};

export default Sidebar;