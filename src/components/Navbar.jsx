import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronDown, CircleHelp, Globe, Mail, Menu, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Dialog, DialogContent, DialogTitle } from './ui/Dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/Select';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../utils/constants';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t, currentLanguage, changeLanguage } = useLanguage();

    const primaryLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/impact', label: t('nav.impact') },
    ];

    const secondaryLinks = [
        { path: '/track', label: t('nav.track'), icon: ArrowRight },
        { path: '/research', label: t('nav.research'), icon: BookOpen },
        { path: '/about', label: t('nav.about'), icon: Sparkles },
        { path: '/contact', label: t('nav.contact'), icon: Mail },
        { path: '/faq', label: t('nav.faq'), icon: CircleHelp },
    ];

    const policyLinks = [
        { path: '/privacy', label: t('footer.privacy') },
        { path: '/terms', label: t('footer.terms') },
    ];

    const isActive = (path) => location.pathname === path;
    const isSecondaryActive = [...secondaryLinks, ...policyLinks].some((link) => isActive(link.path));

    const languageLabel = LANGUAGES.find((lang) => lang.code === currentLanguage)?.name || currentLanguage;

    const linkClasses = (active) => [
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
        active
            ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    ].join(' ');

    const mobileSectionLinkClasses = (active) => [
        'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200',
        active
            ? 'border-primary/20 bg-primary/5 text-primary shadow-sm'
            : 'border-border bg-background hover:border-primary/20 hover:bg-muted/60',
    ].join(' ');

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="container-custom">
                <div className="flex h-16 items-center justify-between gap-3 md:h-20">
                    <Link to="/" className="group flex flex-shrink-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10 transition-transform duration-200 group-hover:scale-105">
                            <img
                                src="/logo.jpg"
                                alt="AFGHANIUM"
                                className="h-8 w-8 rounded-xl object-cover"
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-display text-lg font-bold tracking-tight text-foreground">
                                AFGHANIUM
                            </div>
                            <div className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                                Humanitarian network
                            </div>
                        </div>
                    </Link>

                    <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
                        {primaryLinks.map((link) => (
                            <Button
                                key={link.path}
                                asChild
                                variant="ghost"
                                size="sm"
                                className={linkClasses(isActive(link.path))}
                            >
                                <Link to={link.path}>{link.label}</Link>
                            </Button>
                        ))}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={[
                                        linkClasses(isSecondaryActive),
                                        'gap-1.5 pr-3',
                                    ].join(' ')}
                                >
                                    <span>More</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[28rem] p-0" align="center">
                                <div className="border-b border-border/70 bg-muted/30 px-5 py-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Everything in one place</p>
                                            <p className="text-xs text-muted-foreground">
                                                Quick access to support, stories, and policies.
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                                            <Sparkles className="h-3 w-3" />
                                            Updated
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid gap-4 p-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <p className="px-1 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                            Explore
                                        </p>
                                        <div className="space-y-1">
                                            {secondaryLinks.map((link) => {
                                                const Icon = link.icon;

                                                return (
                                                    <Button
                                                        key={link.path}
                                                        asChild
                                                        variant="ghost"
                                                        className={[
                                                            'h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left',
                                                            isActive(link.path)
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'hover:bg-muted',
                                                        ].join(' ')}
                                                    >
                                                        <Link to={link.path}>
                                                            <Icon className="h-4 w-4 shrink-0" />
                                                            <span>{link.label}</span>
                                                        </Link>
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="px-1 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                            Policies
                                        </p>
                                        <div className="space-y-1">
                                            {policyLinks.map((link) => (
                                                <Button
                                                    key={link.path}
                                                    asChild
                                                    variant="ghost"
                                                    className={[
                                                        'h-auto w-full justify-start rounded-xl px-3 py-3 text-left',
                                                        isActive(link.path)
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'hover:bg-muted',
                                                    ].join(' ')}
                                                >
                                                    <Link to={link.path}>{link.label}</Link>
                                                </Button>
                                            ))}
                                        </div>

                                        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                                            <p className="text-sm font-semibold text-foreground">Need help fast?</p>
                                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                                Jump straight to donation or contact the team.
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Button asChild size="sm" className="rounded-full px-4">
                                                    <Link to="/donate">Donate now</Link>
                                                </Button>
                                                <Button asChild variant="outline" size="sm" className="rounded-full px-4">
                                                    <Link to="/contact">Contact</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <div className="hidden xl:block min-w-36">
                            <Select value={currentLanguage} onValueChange={changeLanguage}>
                                <SelectTrigger className="h-11 rounded-full border-border bg-background px-4 text-sm shadow-sm">
                                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder={languageLabel} />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button asChild variant="outline" className="h-11 rounded-full px-6">
                            <Link to="/shop">Shop</Link>
                        </Button>

                        <Button asChild className="h-11 rounded-full px-6 shadow-lg shadow-primary/20">
                            <Link to="/donate">Donate</Link>
                        </Button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-muted lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DialogContent className="!left-auto !top-0 !h-[100dvh] !w-[min(92vw,24rem)] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-t-0 !border-r-0 !border-b-0 !p-0 sm:!w-[24rem]">
                    <DialogTitle className="sr-only">Mobile navigation</DialogTitle>

                    <div className="flex h-full flex-col bg-background">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
                                    <img src="/logo.jpg" alt="AFGHANIUM" className="h-8 w-8 rounded-xl object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">AFGHANIUM</p>
                                    <p className="text-xs text-muted-foreground">Navigation</p>
                                </div>
                            </div>

                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5">
                            <div className="mb-5 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] uppercase tracking-[0.24em]">
                                        Fast access
                                    </Badge>
                                </div>
                                <p className="mt-3 text-sm font-medium text-foreground">
                                    Find donation paths, updates, and support without digging through the page.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                        Main
                                    </p>
                                    <div className="grid gap-2">
                                        {primaryLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={closeMobileMenu}
                                                className={mobileSectionLinkClasses(isActive(link.path))}
                                            >
                                                <span className="font-medium">{link.label}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                        More
                                    </p>
                                    <div className="grid gap-2">
                                        {secondaryLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={closeMobileMenu}
                                                className={mobileSectionLinkClasses(isActive(link.path))}
                                            >
                                                <span className="font-medium">{link.label}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                        Policies
                                    </p>
                                    <div className="grid gap-2">
                                        {policyLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={closeMobileMenu}
                                                className={mobileSectionLinkClasses(isActive(link.path))}
                                            >
                                                <span className="font-medium">{link.label}</span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-border bg-muted/30 p-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                        Language
                                    </p>
                                    <Select value={currentLanguage} onValueChange={changeLanguage}>
                                        <SelectTrigger className="mt-3 h-12 w-full rounded-2xl bg-background px-4">
                                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder={languageLabel} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.code} value={lang.code}>
                                                    {lang.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border bg-background px-5 py-4">
                            <div className="grid gap-3">
                                <Button asChild variant="outline" className="h-12 rounded-2xl px-5">
                                    <Link to="/shop" onClick={closeMobileMenu}>
                                        Shop
                                    </Link>
                                </Button>
                                <Button asChild className="h-12 rounded-2xl px-5 shadow-lg shadow-primary/20">
                                    <Link to="/donate" onClick={closeMobileMenu}>
                                        Donate now
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="h-12 rounded-2xl px-5">
                                    <Link to="/track" onClick={closeMobileMenu}>
                                        Track donation
                                    </Link>
                                </Button>
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                    <PhoneCall className="h-3.5 w-3.5" />
                                    <span>Support and donation guidance are a tap away.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </nav>
    );
};

export default Navbar;