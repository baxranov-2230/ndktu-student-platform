import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

import {
    Bell,
    User,
    LogOut,
    Sun,
    Moon,
    Menu,
    ChevronRight,
    Search,
} from 'lucide-react';
import { cn } from '@/utils/utils';

interface NavbarProps {
    onMenuClick: () => void;
}

/* Page title map for breadcrumbs */
const pageTitles: Record<string, string> = {
    '': 'Boshqaruv paneli',
    'dashboard': 'Boshqaruv paneli',
    'users': 'Foydalanuvchilar',
    'teachers': "O'qituvchilar",
    'roles': 'Rollar',
    'permissions': 'Ruxsatlar',
    'faculties': 'Fakultetlar',
    'kafedras': 'Kafedralar',
    'groups': 'Guruhlar',
    'students': 'Talabalar',
    'subjects': 'Fanlar',
    'questions': 'Savollar',
    'quizzes': 'Testlar',
    'quiz-test': 'Test topshirish',
    'results': 'Natijalar',
    'profile': 'Profil',
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentPage = pageTitles[pathSegments[0] || ''] || 'Boshqaruv paneli';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/70 backdrop-blur-xl px-4 md:px-6 transition-colors duration-300">
            {/* Left: Mobile menu + Breadcrumb */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
                    title="Menyu"
                >
                    <Menu className="h-4 w-4" />
                </button>

                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center gap-1 text-sm">
                    <Link
                        to="/"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Bosh sahifa
                    </Link>
                    {pathSegments.length > 0 && (
                        <>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                            <span className="font-medium text-foreground">{currentPage}</span>
                        </>
                    )}
                </nav>

                {/* Mobile page title */}
                <h1 className="text-sm font-semibold md:hidden">{currentPage}</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Search hint (desktop only) */}
                <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-muted-foreground/60 text-xs cursor-pointer hover:bg-muted/50 hover:text-muted-foreground transition-colors">
                    <Search className="h-3.5 w-3.5" />
                    <span>Qidirish...</span>
                    <kbd className="ml-2 inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/80">
                        ⌘K
                    </kbd>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
                    title="Mavzu o'zgartirish"
                >
                    <div className="relative h-4 w-4">
                        <Sun className={cn(
                            "absolute inset-0 h-4 w-4 transition-all duration-500",
                            theme === 'dark' ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                        )} />
                        <Moon className={cn(
                            "absolute inset-0 h-4 w-4 transition-all duration-500",
                            theme === 'dark' ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                        )} />
                    </div>
                </button>

                {/* Notifications */}
                <button
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                    title="Bildirishnomalar"
                >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-background" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative ml-1">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors",
                            isProfileOpen ? "bg-muted/60" : "hover:bg-muted/40"
                        )}
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-xs font-bold overflow-hidden ring-1 ring-primary/20">
                            {user?.student?.image_path ? (
                                <img
                                    src={user.student.image_path}
                                    alt={user.username}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <span className="hidden text-xs font-medium md:block text-foreground">
                            {user?.username || 'User'}
                        </span>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                                {/* User info header */}
                                <div className="px-3 py-2 mb-1">
                                    <p className="text-sm font-semibold">{user?.username}</p>
                                    <p className="text-xs text-muted-foreground">Foydalanuvchi</p>
                                </div>

                                <div className="h-px bg-border/50 mx-1 mb-1" />

                                <Link
                                    to="/profile"
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Profil
                                </Link>

                                <div className="h-px bg-border/50 mx-1 my-1" />

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Chiqish
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
