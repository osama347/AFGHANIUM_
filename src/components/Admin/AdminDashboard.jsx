import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  LayoutDashboard,
  Heart,
  DollarSign,
  LogOut,
  Menu,
  X,
  Mail,
  Settings,
  FileText,
  AlertTriangle,
  BookOpen,
  Package,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import Loader from '../Loader';
import { supabase } from '../../supabase/client';
import { getUnreadCount } from '../../supabase/messages';
import { checkAdminAuth } from '../../supabase/admin';

const AdminLayout = () => {
  const { isAuthenticated, loading, logout, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const verifyAndRedirect = async () => {
      if (loading || isAuthenticated) return;

      const result = await checkAdminAuth();
      if (cancelled) return;

      if (!result.success || !result.isAuthenticated) {
        navigate('/admin');
      }
    };

    verifyAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      const result = await getUnreadCount();
      if (result.success) {
        setUnreadCount(result.count);
      }
    };

    fetchUnread();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
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
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/admin/donations', icon: DollarSign, label: 'Donations', badge: null },
    { path: '/admin/impacts', icon: Heart, label: 'Impact Proofs', badge: null },
    {
      path: '/admin/inbox',
      icon: Mail,
      label: 'Inbox',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { path: '/admin/emergency', icon: AlertTriangle, label: 'Emergency', badge: null },
    { path: '/admin/research', icon: BookOpen, label: 'Research', badge: null },
    { path: '/admin/products', icon: Package, label: 'Products', badge: null },
    { path: '/admin/content', icon: FileText, label: 'Content', badge: null },
    { path: '/admin/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col w-64 bg-card border-r border-border transition-all duration-300 overflow-hidden',
          !isSidebarOpen && 'w-20'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className={cn('flex items-center transition-all', !isSidebarOpen && 'justify-center w-full')}>
            <img
              src="/logo.jpg"
              alt="AFGHANIUM"
              className="h-8 w-8 rounded object-cover"
            />
            {isSidebarOpen && <span className="ml-3 text-lg font-bold text-primary">ADMIN</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                title={!isSidebarOpen ? item.label : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border space-y-2">
          {isSidebarOpen && (
            <div className="px-2 py-2 text-xs">
              <p className="text-muted-foreground truncate">Signed in as</p>
              <p className="font-semibold text-foreground truncate">{user?.email || 'Admin'}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-card border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="text-lg font-bold text-primary">AFGHANIUM Admin</div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-b border-border overflow-y-auto max-h-[calc(100vh-73px)]">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-border mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-secondary/5">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
