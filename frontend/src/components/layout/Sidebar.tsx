import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Users,
    GraduationCap,
    BookOpen,
    FileText,
    BarChart,
    Shield,
    Key,
    Building2,
    Layers,
    UsersRound,
    FileQuestion,
    PlayCircle,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/context/AuthContext';

import logo from '@/assets/logo.png';

interface SidebarProps {
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

interface NavGroup {
    title: string;
    items: { name: string; href: string; icon: React.ElementType }[];
}

const Sidebar = ({ mobileOpen, setMobileOpen }: SidebarProps) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(true);

    const isStudent = user?.roles?.some(role => role.name.toLowerCase() === 'student');
    const isTeacher = user?.roles?.some(role => role.name.toLowerCase() === 'teacher');

    const adminGroups: NavGroup[] = [
        {
            title: 'Asosiy',
            items: [
                { name: 'Boshqaruv paneli', href: '/', icon: BarChart },
            ],
        },
        {
            title: 'Boshqaruv',
            items: [
                { name: 'Foydalanuvchilar', href: '/users', icon: Users },
                { name: "O'qituvchilar", href: '/teachers', icon: GraduationCap },
                { name: 'Rollar', href: '/roles', icon: Shield },
                { name: 'Ruxsatlar', href: '/permissions', icon: Key },
            ],
        },
        {
            title: "Ta'lim",
            items: [
                { name: 'Fakultetlar', href: '/faculties', icon: Building2 },
                { name: 'Kafedralar', href: '/kafedras', icon: Layers },
                { name: 'Guruhlar', href: '/groups', icon: UsersRound },
                { name: 'Talabalar', href: '/students', icon: GraduationCap },
                { name: 'Fanlar', href: '/subjects', icon: BookOpen },
            ],
        },
        {
            title: 'Testlar',
            items: [
                { name: 'Savollar', href: '/questions', icon: FileQuestion },
                { name: 'Testlar', href: '/quizzes', icon: BookOpen },
                { name: 'Test', href: '/quiz-test', icon: PlayCircle },
                { name: 'Natijalar', href: '/results', icon: FileText },
            ],
        },
    ];

    const teacherGroups: NavGroup[] = [
        {
            title: 'Asosiy',
            items: [
                { name: 'Savollar', href: '/questions', icon: FileQuestion },
                { name: 'Natijalar', href: '/results', icon: FileText },
            ],
        },
    ];

    const studentGroups: NavGroup[] = [
        {
            title: 'Asosiy',
            items: [
                { name: 'Test', href: '/quiz-test', icon: PlayCircle },
                { name: 'Natijalar', href: '/results', icon: FileText },
            ],
        },
    ];

    const navGroups = isStudent
        ? studentGroups
        : isTeacher
            ? teacherGroups
            : adminGroups;

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-border/40 bg-card/80 backdrop-blur-2xl shadow-[4px_0_24px_-2px_rgba(0,0,0,0.03)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:static dark:bg-card/40 dark:border-border/20",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    isCollapsed ? "w-[72px]" : "w-[260px]"
                )}
            >
                {/* Logo + Collapse Toggle */}
                <div className={cn(
                    "flex h-16 shrink-0 items-center border-b border-border/30 transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "justify-between px-5"
                )}>
                    <div
                        className={cn(
                            "flex items-center gap-3 cursor-pointer",
                            isCollapsed && "justify-center"
                        )}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <div className="relative flex items-center justify-center rounded-xl bg-primary/5 p-1.5 ring-1 ring-border/50 hover:ring-primary/30 transition-all duration-300 dark:bg-white/5">
                            <img
                                src={logo}
                                alt="NDKTU Logo"
                                className={cn(
                                    "object-contain transition-all duration-500",
                                    isCollapsed ? "h-8 w-8" : "h-7 w-7"
                                )}
                            />
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
                                <span className="text-[12px] font-bold leading-tight tracking-wide text-foreground/90">
                                    NDKTU
                                </span>
                                <span className="text-[10px] font-medium text-muted-foreground/70 truncate">
                                    Talabalar platformasi
                                </span>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                            title="Yig'ish"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    <nav className={cn("flex flex-col gap-6", isCollapsed ? "items-center px-2" : "px-3")}>
                        {navGroups.map((group, groupIdx) => (
                            <div key={groupIdx}>
                                {/* Group Title */}
                                <div className={cn(
                                    "transition-all duration-300 mb-2",
                                    isCollapsed
                                        ? "opacity-0 h-0 overflow-hidden m-0"
                                        : "px-3 opacity-100"
                                )}>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
                                        {group.title}
                                    </p>
                                </div>

                                {/* Collapsed divider */}
                                {isCollapsed && groupIdx > 0 && (
                                    <div className="w-6 h-px bg-border/50 mb-2" />
                                )}

                                {/* Items */}
                                <div className={cn("flex flex-col", isCollapsed ? "items-center gap-1" : "gap-0.5")}>
                                    {group.items.map((item) => {
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                title={isCollapsed ? item.name : undefined}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "group relative flex items-center rounded-xl transition-all duration-300 overflow-hidden",
                                                    isCollapsed
                                                        ? "h-10 w-10 justify-center p-0"
                                                        : "px-3 py-2.5 text-[13px] font-medium",
                                                    isActive
                                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                                )}
                                            >
                                                {/* Active indicator for collapsed */}
                                                {isActive && isCollapsed && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-white shadow-sm" />
                                                )}

                                                <item.icon
                                                    className={cn(
                                                        "transition-all duration-300 shrink-0",
                                                        isCollapsed ? "h-[18px] w-[18px]" : "h-4 w-4 mr-2.5",
                                                        isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                                                    )}
                                                />

                                                {!isCollapsed && (
                                                    <span className={cn(
                                                        "transition-all duration-200 truncate",
                                                        !isActive && "group-hover:translate-x-0.5"
                                                    )}>
                                                        {item.name}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Expand button when collapsed */}
                {isCollapsed && (
                    <div className="flex justify-center py-3 border-t border-border/30">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                            title="Kengaytirish"
                        >
                            <PanelLeft className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* User Info Footer (expanded only) */}
                {!isCollapsed && (
                    <div className="p-3 border-t border-border/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-muted/60 transition-all duration-200 group"
                        >
                            <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-sm font-bold ring-1 ring-primary/20">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col overflow-hidden flex-1">
                                <span className="text-xs font-semibold text-foreground truncate">
                                    {user?.username || 'Foydalanuvchi'}
                                </span>
                                <span className="text-[10px] text-muted-foreground/70">
                                    {isStudent ? 'Talaba' : isTeacher ? "O'qituvchi" : 'Administrator'}
                                </span>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
