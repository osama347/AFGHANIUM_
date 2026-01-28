import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { LayoutDashboard, Heart, DollarSign, LogOut, Menu, Mail, Settings, FileText, AlertTriangle, BookOpen } from 'lucide-react';
import Loader from '../Loader';
import { supabase } from '../../supabase/client';
import { getUnreadCount } from '../../supabase/messages';

const AdminDashboard = () => {
    const { isAuthenticated, loading, logout, user } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, loading, navigate]);

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Fetch unread count and subscribe to changes
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchUnread = async () => {
            const result = await getUnreadCount();
            if (result.success) {
                setUnreadCount(result.count);
            }
        };

        fetchUnread();

        // Realtime subscription
        const subscription = supabase
            .channel('messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
                // Refetch count on any change (Insert, Update, Delete) to ensure accuracy
                fetchUnread();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [isAuthenticated]);

    const handleLogout = async () => {
        await logout();
        navigate('/admin');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/donations', icon: DollarSign, label: 'Donations' },
        { path: '/admin/impacts', icon: Heart, label: 'Impact Proofs' },
        {
            path: '/admin/inbox',
            icon: Mail,
            label: 'Inbox',
            badge: unreadCount > 0 ? unreadCount : null
        },
        { path: '/admin/emergency', icon: AlertTriangle, label: 'Emergency' },
        { path: '/admin/research', icon: BookOpen, label: 'Research' },
        { path: '/admin/content', icon: FileText, label: 'Content' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-md fixed w-full z-30 top-0 left-0">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <Link to="/admin/dashboard" className="flex-shrink-0">
                                <img
                                    src="/logo.jpg"
                                    alt="AFGHANIUM Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                            <div className="hidden md:block">
                                <div className="text-xl font-bold text-primary-dark leading-none">AFGHANIUM</div>
                                <div className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Admin Portal</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block text-gray-600">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16">
                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed md:sticky top-16 left-0 z-20 w-64 bg-white min-h-[calc(100vh-4rem)] shadow-md transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${location.pathname === item.path
                                        ? 'bg-white text-primary'
                                        : 'bg-red-500 text-white'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
