import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex min-h-[70vh] items-center bg-background">
            <div className="container-custom">
                <p className="font-display text-8xl font-bold tracking-tight text-primary sm:text-9xl">404</p>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Page not found</h1>
                <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <Home className="h-4 w-4" />
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
