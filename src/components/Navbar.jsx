import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ArrowRight,
    BookOpen,
    ChevronDown,
    CircleHelp,
    Menu,
    Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t } = useLanguage();

    const primaryLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/impact', label: t('nav.impact') },
        { path: '/track', label: t('nav.track') },
        { path: '/research', label: t('nav.research') },
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
    ];

    const moreLinks = [
        { path: '/faq', label: t('nav.faq'), icon: CircleHelp },
        { path: '/privacy', label: t('footer.privacy'), icon: Sparkles },
        { path: '/terms', label: t('footer.terms'), icon: BookOpen },
    ];

    const isActivePath = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const currentLabel = [...primaryLinks, ...moreLinks].find((link) => isActivePath(link.path))?.label;
    const isMoreActive = moreLinks.some((link) => isActivePath(link.path));

    const desktopLinkClasses = (active) => [
        'inline-flex items-center border-b-2 px-0.5 py-2 text-sm font-semibold tracking-tight transition-colors duration-200',
        active
            ? 'border-primary text-primary'
            : 'border-transparent text-foreground/65 hover:border-border hover:text-foreground',
    ].join(' ');

    const mobileLinkClasses = (active) => [
        'group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200',
        active
            ? 'border-primary/30 bg-primary/10 text-primary'
            : 'border-border bg-background hover:border-primary/20 hover:bg-muted/60',
    ].join(' ');

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-xl">
            <div className="container-custom">
                <div className="flex h-20 items-center justify-between gap-4">
                    <Link to="/" className="group flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-card shadow-sm transition-transform duration-300 group-hover:-rotate-3">
                            <img src="/logo.jpg" alt="AFGHANIUM" className="h-8 w-8 rounded-lg object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
                                Afghanium
                            </p>
                            <span className="hidden text-[10px] uppercase tracking-[0.32em] text-muted-foreground sm:block">
                                Humanitarian network
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-6 xl:flex">
                        {primaryLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                aria-current={isActivePath(link.path) ? 'page' : undefined}
                                className={desktopLinkClasses(isActivePath(link.path))}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={[
                                        'inline-flex items-center gap-1 border-b-2 border-transparent py-2 text-sm font-semibold tracking-tight transition-colors duration-200',
                                        isMoreActive ? 'border-primary text-primary' : 'text-foreground/65 hover:text-foreground',
                                    ].join(' ')}
                                >
                                    Explore
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent align="end" sideOffset={18} className="w-80 rounded-2xl border-border/80 bg-popover/98 p-2 shadow-xl">
                                <div className="mb-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">More pages</p>
                                </div>

                                <div className="space-y-1">
                                    {moreLinks.map((link) => {
                                        const Icon = link.icon;
                                        const active = isActivePath(link.path);
                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className={[
                                                    'group flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all duration-200',
                                                    active
                                                        ? 'border-primary/30 bg-primary/10 text-primary'
                                                        : 'border-transparent text-foreground hover:border-border hover:bg-muted/50',
                                                ].join(' ')}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className="h-4 w-4" />
                                                    <span className="font-medium">{link.label}</span>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="hidden items-center gap-3 xl:flex">
                        <Button asChild variant="outline" className="h-11 px-5">
                            <Link to="/shop">Shop</Link>
                        </Button>
                        <Button asChild className="h-11 px-5 shadow-md shadow-primary/20">
                            <Link to="/donate">Donate</Link>
                        </Button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-all hover:bg-muted xl:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DialogContent className="!left-1/2 !top-1/2 !h-[min(92dvh,46rem)] !w-[min(94vw,26rem)] !max-w-none !translate-x-[-50%] !translate-y-[-50%] !rounded-[1.75rem] !border !p-0">
                    <DialogTitle className="sr-only">Mobile navigation</DialogTitle>

                    <div className="flex h-full flex-col overflow-hidden bg-background">
                        <div className="border-b border-border/70 px-5 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-card shadow-sm">
                                    <img src="/logo.jpg" alt="AFGHANIUM" className="h-8 w-8 rounded-lg object-cover" />
                                </div>
                                <div>
                                    <p className="font-display text-lg font-bold tracking-tight text-foreground">Afghanium</p>
                                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Navigation hub</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                                <Badge variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
                                    Current page
                                </Badge>
                                <p className="mt-3 text-lg font-semibold text-foreground">
                                    {currentLabel || 'Welcome'}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Use this quick menu to move through the site.
                                </p>
                            </div>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <div className="mb-3 px-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                                            Main
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        {primaryLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={closeMobileMenu}
                                                className={mobileLinkClasses(isActivePath(link.path))}
                                            >
                                                <span>{link.label}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 px-1">
                                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                                            More
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        {moreLinks.map((link) => {
                                            const Icon = link.icon;
                                            const active = isActivePath(link.path);

                                            return (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={closeMobileMenu}
                                                    className={mobileLinkClasses(active)}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Icon className="h-4 w-4" />
                                                        <span>{link.label}</span>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="border-t border-border/70 px-5 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Button asChild variant="outline" className="h-11">
                                    <Link to="/shop" onClick={closeMobileMenu}>Shop</Link>
                                </Button>
                                <Button asChild className="h-11 shadow-lg shadow-primary/20">
                                    <Link to="/donate" onClick={closeMobileMenu}>Donate</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </nav>
    );
};

export default Navbar;
