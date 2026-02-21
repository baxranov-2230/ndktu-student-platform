import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar mesh-gradient">
                    <div key={location.pathname} className="page-transition h-full relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

