import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
    Users,
    BookOpen,
    GraduationCap,
    CheckCircle,
    FileQuestion,
    Book,
    UserCheck,
    LogOut,
    Activity,
    TrendingUp,
    Plus,
    ArrowRight,
    Sparkles,
    Calendar,
    Clock,
    BarChart3,
    Shield,
    Zap,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { teacherService } from '@/services/teacherService';
import { studentService } from '@/services/studentService';
import { subjectService } from '@/services/subjectService';
import { quizService } from '@/services/quizService';
import { questionService } from '@/services/questionService';
import { resultService } from '@/services/resultService';
import { Button } from '@/components/ui/Button';

/* ==============================
   Animated Counter Hook
   ============================== */
const useAnimatedCounter = (end: number, duration = 1200) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (end === 0 || hasAnimated.current) return;
        hasAnimated.current = true;

        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration]);

    return { count, ref };
};

/* ==============================
   Stat Card Component
   ============================== */
interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    description?: string;
    isLoading?: boolean;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan';
    stagger?: number;
}

const colorConfig = {
    blue: {
        iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
        iconText: 'text-blue-600 dark:text-blue-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)]',
        accent: 'from-blue-500/10 to-transparent',
        dot: 'bg-blue-500',
    },
    purple: {
        iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
        iconText: 'text-purple-600 dark:text-purple-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(168,85,247,0.15)]',
        accent: 'from-purple-500/10 to-transparent',
        dot: 'bg-purple-500',
    },
    green: {
        iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        iconText: 'text-emerald-600 dark:text-emerald-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)]',
        accent: 'from-emerald-500/10 to-transparent',
        dot: 'bg-emerald-500',
    },
    orange: {
        iconBg: 'bg-orange-500/10 dark:bg-orange-500/15',
        iconText: 'text-orange-600 dark:text-orange-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.15)]',
        accent: 'from-orange-500/10 to-transparent',
        dot: 'bg-orange-500',
    },
    pink: {
        iconBg: 'bg-pink-500/10 dark:bg-pink-500/15',
        iconText: 'text-pink-600 dark:text-pink-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(236,72,153,0.15)]',
        accent: 'from-pink-500/10 to-transparent',
        dot: 'bg-pink-500',
    },
    cyan: {
        iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
        iconText: 'text-cyan-600 dark:text-cyan-400',
        glow: 'group-hover:shadow-[0_8px_30px_-4px_rgba(6,182,212,0.15)]',
        accent: 'from-cyan-500/10 to-transparent',
        dot: 'bg-cyan-500',
    },
};

const StatCard = ({ label, value, icon: Icon, description, isLoading, color, stagger = 1 }: StatCardProps) => {
    const { count } = useAnimatedCounter(isLoading ? 0 : value);
    const cfg = colorConfig[color];

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-500 hover:-translate-y-1.5",
            cfg.glow,
            `stagger-${stagger}`
        )}>
            {/* Gradient accent top border */}
            <div className={cn("absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500", cfg.accent.replace('to-transparent', 'via-current to-transparent'))} />

            {/* Background watermark icon */}
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                <Icon className="h-32 w-32" />
            </div>

            <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                    "inline-flex items-center justify-center rounded-xl p-3 mb-4 transition-all duration-300 group-hover:scale-110",
                    cfg.iconBg
                )}>
                    <Icon className={cn("h-5 w-5", cfg.iconText)} />
                </div>

                {/* Label */}
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>

                {/* Value */}
                {isLoading ? (
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
                ) : (
                    <h3 className="text-3xl font-bold tracking-tight count-up">
                        {count.toLocaleString()}
                    </h3>
                )}

                {/* Description */}
                {description && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <div className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                        <span>{description}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ==============================
   Quick Action Card
   ============================== */
interface QuickActionProps {
    label: string;
    description: string;
    icon: React.ElementType;
    href: string;
    color: string;
}

const QuickAction = ({ label, description, icon: Icon, href, color }: QuickActionProps) => (
    <Link
        to={href}
        className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
    >
        <div className={cn(
            "flex shrink-0 items-center justify-center rounded-xl p-3 transition-all duration-300 group-hover:scale-110",
            color
        )}>
            <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </Link>
);

/* ==============================
   Progress Stat Row
   ============================== */
interface ProgressStatProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

const ProgressStat = ({ label, value, total, color }: ProgressStatProps) => {
    const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground">{value} / {total}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                    className={cn("h-full rounded-full progress-bar", color)}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

/* ==============================
   Dashboard Main
   ============================== */
const Dashboard = () => {
    const { user, logout } = useAuth();

    const { data: users, isLoading: isUsersLoading } = useQuery({
        queryKey: ['dashboard-users'],
        queryFn: () => userService.getUsers(1, 1),
    });

    const { data: teachers, isLoading: isTeachersLoading } = useQuery({
        queryKey: ['dashboard-teachers'],
        queryFn: () => teacherService.getTeachers(1, 1),
    });

    const { data: students, isLoading: isStudentsLoading } = useQuery({
        queryKey: ['dashboard-students'],
        queryFn: () => studentService.getStudents(1, 1),
    });

    const { data: subjects, isLoading: isSubjectsLoading } = useQuery({
        queryKey: ['dashboard-subjects'],
        queryFn: () => subjectService.getSubjects(1, 1),
    });

    const { data: quizzes, isLoading: isQuizzesLoading } = useQuery({
        queryKey: ['dashboard-quizzes'],
        queryFn: () => quizService.getQuizzes(1, 1),
    });

    const { data: questions, isLoading: isQuestionsLoading } = useQuery({
        queryKey: ['dashboard-questions'],
        queryFn: () => questionService.getQuestions(1, 1),
    });

    const { data: results, isLoading: isResultsLoading } = useQuery({
        queryKey: ['dashboard-results'],
        queryFn: () => resultService.getResults(1, 1),
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Xayrli tong';
        if (hour < 18) return 'Xayrli kun';
        return 'Xayrli kech';
    };

    const getFormattedDate = () => {
        return new Date().toLocaleDateString('uz-UZ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getFormattedTime = () => {
        return new Date().toLocaleTimeString('uz-UZ', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const [currentTime, setCurrentTime] = useState(getFormattedTime());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(getFormattedTime()), 60_000);
        return () => clearInterval(timer);
    }, []);

    const totalResources = (users?.total || 0) + (teachers?.total || 0) + (students?.total || 0);

    return (
        <div className="space-y-8 pb-8">

            {/* ==================== HERO SECTION ==================== */}
            <div className="stagger-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 dark:from-primary/90 dark:via-blue-700 dark:to-indigo-900 p-8 md:p-10 animated-gradient">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl" />
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/20 rounded-full float" />
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white/10 rounded-full float-delayed" />
                <div className="absolute bottom-1/3 right-1/2 w-1.5 h-1.5 bg-white/15 rounded-full float" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className="capitalize">{getFormattedDate()}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-4 w-4" />
                            <span>{currentTime}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            {getGreeting()}, <span className="text-white/90">{user?.username}</span> 👋
                        </h1>

                        <p className="text-white/60 text-base md:text-lg max-w-xl">
                            Universitet boshqaruv paneliga xush kelibsiz. Bugungi ko'rsatkichlaringiz va tizim holatini kuzating.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-2.5 text-white/80 text-sm border border-white/10">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span>{totalResources} jami resurslar</span>
                        </div>
                        <Button variant="danger" onClick={logout} className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 shadow-none hover:shadow-none hover:translate-y-0">
                            <LogOut className="mr-2 h-4 w-4" />
                            Chiqish
                        </Button>
                    </div>
                </div>
            </div>

            {/* ==================== STAT CARDS GRID ==================== */}
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Foydalanuvchilar"
                    value={users?.total || 0}
                    icon={Users}
                    isLoading={isUsersLoading}
                    color="blue"
                    description="Faol foydalanuvchilar"
                    stagger={2}
                />
                <StatCard
                    label="Talabalar"
                    value={students?.total || 0}
                    icon={UserCheck}
                    isLoading={isStudentsLoading}
                    color="purple"
                    description="Ro'yxatdan o'tgan"
                    stagger={3}
                />
                <StatCard
                    label="O'qituvchilar"
                    value={teachers?.total || 0}
                    icon={GraduationCap}
                    isLoading={isTeachersLoading}
                    color="cyan"
                    description="Barcha kafedralar"
                    stagger={4}
                />
                <StatCard
                    label="Faol testlar"
                    value={quizzes?.total || 0}
                    icon={BookOpen}
                    isLoading={isQuizzesLoading}
                    color="pink"
                    description="Talabalar uchun ochiq"
                    stagger={5}
                />
            </div>

            {/* ==================== SECONDARY STATS ==================== */}
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                <StatCard
                    label="Savollar banki"
                    value={questions?.total || 0}
                    icon={FileQuestion}
                    isLoading={isQuestionsLoading}
                    color="orange"
                    description="Jami savollar"
                    stagger={5}
                />
                <StatCard
                    label="Fanlar"
                    value={subjects?.total || 0}
                    icon={Book}
                    isLoading={isSubjectsLoading}
                    color="green"
                    description="Faol kurslar"
                    stagger={6}
                />
                <StatCard
                    label="Natijalar"
                    value={results?.total || 0}
                    icon={CheckCircle}
                    isLoading={isResultsLoading}
                    color="blue"
                    description="Jami topshirilganlar"
                    stagger={7}
                />
            </div>

            {/* ==================== QUICK ACTIONS + ACTIVITY ==================== */}
            <div className="grid gap-6 md:grid-cols-2 stagger-6">

                {/* Quick Actions */}
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
                            <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">Tezkor amallar</h2>
                    </div>
                    <div className="grid gap-3">
                        <QuickAction
                            label="Yangi test yaratish"
                            description="Test va savol qo'shish"
                            icon={Plus}
                            href="/quizzes"
                            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        />
                        <QuickAction
                            label="Talabalarni boshqarish"
                            description="Talabalar ro'yxati"
                            icon={GraduationCap}
                            href="/students"
                            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        />
                        <QuickAction
                            label="Savollar banki"
                            description="Savollarni qo'shish va tahrirlash"
                            icon={FileQuestion}
                            href="/questions"
                            color="bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        />
                        <QuickAction
                            label="Natijalarni ko'rish"
                            description="Test natijalari va tahlil"
                            icon={BarChart3}
                            href="/results"
                            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        />
                    </div>
                </div>

                {/* System Status + Progress */}
                <div className="space-y-6">
                    {/* System Status */}
                    <div className="rounded-2xl border border-border/50 bg-card p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center justify-center rounded-lg bg-emerald-500/10 p-2">
                                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold">Tizim holati</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 transition-colors hover:bg-muted/60">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                    </div>
                                    <span className="text-sm font-medium">Ma'lumotlar bazasi</span>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Barqaror</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 transition-colors hover:bg-muted/60">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                    </div>
                                    <span className="text-sm font-medium">API gateway</span>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Ishlamoqda</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 transition-colors hover:bg-muted/60">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                    </div>
                                    <span className="text-sm font-medium">Autentifikatsiya</span>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Faol</span>
                            </div>
                        </div>
                    </div>

                    {/* Resource Overview */}
                    <div className="rounded-2xl border border-border/50 bg-card p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center justify-center rounded-lg bg-blue-500/10 p-2">
                                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg font-semibold">Resurslar</h2>
                        </div>
                        <div className="space-y-4">
                            <ProgressStat
                                label="Testlar yaratilgan"
                                value={quizzes?.total || 0}
                                total={Math.max(quizzes?.total || 0, 50)}
                                color="bg-blue-500"
                            />
                            <ProgressStat
                                label="Savollar bazasi"
                                value={questions?.total || 0}
                                total={Math.max(questions?.total || 0, 200)}
                                color="bg-orange-500"
                            />
                            <ProgressStat
                                label="Topshirilgan natijalar"
                                value={results?.total || 0}
                                total={Math.max(results?.total || 0, 100)}
                                color="bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== BOTTOM INFO CARD ==================== */}
            <div className="stagger-7 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-primary/5 p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="flex shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-5">
                    <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">Akademik mukammallik platformasi</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Navoiy davlat konchilik va texnologiyalar universiteti — kengaytirilgan boshqaruv paneli orqali muassasangizning akademik resurslarini samarali boshqaring.
                    </p>
                </div>
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                    Profil
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
