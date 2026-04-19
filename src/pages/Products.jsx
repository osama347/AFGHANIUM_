import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertCircle,
    CheckCircle,
    Eye,
    Filter,
    Grid3X3,
    Minus,
    Package,
    Plus,
    Search,
    Send,
    SlidersHorizontal,
    ShoppingBag,
    ShoppingCart,
    SortAsc,
    Rows3,
    Trash2,
} from 'lucide-react';
import Loader from '../components/Loader';
import { useProduct } from '../hooks/useProduct';
import { createMessage } from '../supabase/messages';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Textarea } from '../components/ui/FormElements';

const Products = () => {
    const { getActive, loading } = useProduct();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [cartOpen, setCartOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [status, setStatus] = useState({ loading: false, error: null, success: false });
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        email: '',
        country: '',
        company: '',
        message: '',
    });

    async function fetchProducts() {
        const result = await getActive();
        if (result.success) {
            setProducts(result.data || []);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const categories = useMemo(() => {
        const categorySet = new Set(
            products
                .map((product) => product.category)
                .filter(Boolean)
                .map((category) => category.trim())
        );

        return ['all', ...Array.from(categorySet)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const visible = products.filter((product) => {
            const inCategory = selectedCategory === 'all' || product.category === selectedCategory;
            if (!inCategory) return false;

            if (!query) return true;

            const searchableText = [
                product.name_en,
                product.category,
                product.origin_region,
                product.description_en,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(query);
        });

        const sorted = [...visible];

        if (sortBy === 'name_asc') {
            sorted.sort((a, b) => (a.name_en || '').localeCompare(b.name_en || ''));
        } else if (sortBy === 'name_desc') {
            sorted.sort((a, b) => (b.name_en || '').localeCompare(a.name_en || ''));
        } else if (sortBy === 'newest') {
            sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        } else {
            sorted.sort((a, b) => {
                const left = Number(a.display_order) || 999;
                const right = Number(b.display_order) || 999;
                return left - right;
            });
        }

        return sorted;
    }, [products, searchTerm, selectedCategory, sortBy]);

    const cartItemCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );

    const distinctItemCount = cartItems.length;

    const handleCheckoutChange = (event) => {
        const { name, value } = event.target;
        setCheckoutData((prev) => ({ ...prev, [name]: value }));
    };

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name_en,
                    description: product.description_en || '',
                    category: product.category || 'General',
                    origin: product.origin_region || 'Afghanistan',
                    image: product.image_url || '',
                    quantity: 1,
                },
            ];
        });

        setStatus({ loading: false, error: null, success: false });
    };

    const clearCart = () => {
        setCartItems([]);
        setStatus({ loading: false, error: null, success: false });
    };

    const updateCartQuantity = (productId, nextQuantity) => {
        if (nextQuantity <= 0) {
            setCartItems((prev) => prev.filter((item) => item.id !== productId));
            return;
        }

        setCartItems((prev) => prev.map((item) => (
            item.id === productId ? { ...item, quantity: nextQuantity } : item
        )));
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (cartItems.length === 0) {
            setStatus({ loading: false, error: 'Your cart is empty. Add products before placing an order request.', success: false });
            return;
        }

        if (!checkoutData.name.trim() || !checkoutData.email.trim() || !checkoutData.country.trim()) {
            setStatus({ loading: false, error: 'Name, email, and country are required.', success: false });
            return;
        }

        setStatus({ loading: true, error: null, success: false });

        const lines = cartItems.map((item, index) => (
            `${index + 1}. ${item.name} | Qty: ${item.quantity} | Category: ${item.category} | Origin: ${item.origin}`
        ));

        const companyLine = checkoutData.company.trim()
            ? `Company: ${checkoutData.company.trim()}`
            : 'Company: not specified';

        const buyerMessage = checkoutData.message.trim()
            ? `\nBuyer notes:\n${checkoutData.message.trim()}`
            : '';

        const result = await createMessage({
            name: checkoutData.name,
            email: checkoutData.email,
            subject: `Shop order request (${cartItems.length} item${cartItems.length > 1 ? 's' : ''})`,
            message: [
                `Buyer country: ${checkoutData.country}`,
                companyLine,
                'Payment method: not collected yet (manual follow-up required).',
                '',
                'Requested products:',
                ...lines,
                buyerMessage,
            ].join('\n'),
        });

        if (result.success) {
            setStatus({ loading: false, error: null, success: true });
            setCheckoutData({ name: '', email: '', country: '', company: '', message: '' });
            setCartItems([]);
            return;
        }

        setStatus({ loading: false, error: result.error, success: false });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
                <div className="container-custom flex h-16 items-center justify-between">
                    <Link to="/shop" className="group flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 transition-colors group-hover:border-primary/40">
                            <img src="/logo.jpg" alt="AFGHANIUM" className="h-8 w-8 rounded-lg object-cover" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="font-display text-base font-bold tracking-wide">AFGHANIUM MARKET</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Direct from Afghanistan</span>
                        </div>
                    </Link>

                    <Button
                        type="button"
                        variant="outline"
                        className="group relative h-10 rounded-full border-border/70 px-5"
                        onClick={() => setCartOpen(true)}
                    >
                        <ShoppingBag className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-semibold">Cart</span>
                        {cartItemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {cartItemCount}
                            </span>
                        )}
                    </Button>
                </div>
            </header>

            <main className="container-custom py-8 md:py-10">
                <section className="mb-8 rounded-3xl border border-border/70 bg-gradient-to-b from-muted/40 to-background p-6 md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Curated Export Shop</p>
                            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                                A focused shop, not a donation catalog.
                            </h1>
                            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                                Browse authentic Afghan products, build your request list, and send one clean order inquiry to our team.
                            </p>
                        </div>
                        <div className="grid w-full max-w-md grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-border bg-background p-3 text-center">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Products</p>
                                <p className="mt-1 text-xl font-semibold">{products.length}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background p-3 text-center">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Categories</p>
                                <p className="mt-1 text-xl font-semibold">{Math.max(categories.length - 1, 0)}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-background p-3 text-center">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">In cart</p>
                                <p className="mt-1 text-xl font-semibold">{cartItemCount}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8 space-y-5 rounded-3xl border border-border/70 bg-card p-4 md:p-5">
                    <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
                        <div className="relative md:col-span-5">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by product, region, or category"
                                className="h-11 rounded-xl border-border/70 pl-11"
                            />
                        </div>

                        <div className="relative md:col-span-3">
                            <Filter className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-11 rounded-xl border-border/70 pl-11 text-sm">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category === 'all' ? 'All categories' : category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative md:col-span-2">
                            <SortAsc className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-11 rounded-xl border-border/70 pl-11 text-sm">
                                    <SelectValue placeholder="Featured" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="name_asc">A-Z</SelectItem>
                                    <SelectItem value="name_desc">Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 md:col-span-2 md:justify-end">
                            <Tabs value={viewMode} onValueChange={setViewMode}>
                                <TabsList className="h-10 rounded-xl border border-border/70 bg-muted/40 p-1">
                                    <TabsTrigger value="grid" className="h-8 w-9 px-0" aria-label="Grid view">
                                        <Grid3X3 className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="list" className="h-8 w-9 px-0" aria-label="List view">
                                        <Rows3 className="h-4 w-4" />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                            {filteredProducts.length} products
                        </Badge>
                        <Badge variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                            {distinctItemCount} cart items
                        </Badge>
                        {cartItemCount > 0 && (
                            <Badge className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                {cartItemCount} total units
                            </Badge>
                        )}
                        {(searchTerm || selectedCategory !== 'all' || sortBy !== 'featured') && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-8 rounded-full px-3 text-xs"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('featured');
                                }}
                            >
                                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                                Reset filters
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <Button
                                    key={category}
                                    type="button"
                                    variant={isActive ? 'default' : 'outline'}
                                    className="h-8 rounded-full px-3 text-xs"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category === 'all' ? 'All' : category}
                                </Button>
                            );
                        })}
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader size="lg" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <Card className="border-border/70 bg-muted/20 shadow-none">
                        <CardContent className="p-14 text-center">
                            <div className="mb-4 flex justify-center">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                            <h2 className="mb-2 text-2xl font-semibold">No products found</h2>
                            <p className="mb-6 text-muted-foreground">
                                {searchTerm ? `No results for "${searchTerm}".` : 'Try adjusting your filters.'}
                            </p>
                            <Button variant="outline" onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                                setSortBy('featured');
                            }}>
                                Clear filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : viewMode === 'list' ? (
                    <div className="space-y-4">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden border-border/70">
                                <CardContent className="p-0">
                                    <div className="grid gap-4 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:p-5">
                                        <div className="h-40 overflow-hidden rounded-xl bg-muted/40 sm:h-28">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name_en}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-lg font-semibold">{product.name_en}</h2>
                                                <Badge variant="secondary" className="rounded-full text-[11px]">
                                                    {product.category || 'General'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">From {product.origin_region || 'Afghanistan'}</p>
                                            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                                                {product.description_en || 'Authentic Afghan product available for global buyers.'}
                                            </p>
                                        </div>

                                        <div className="flex flex-row gap-2 sm:flex-col sm:items-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="rounded-full"
                                                onClick={() => setQuickViewProduct(product)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Quick view
                                            </Button>
                                            <Button type="button" className="rounded-full" onClick={() => addToCart(product)}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="relative h-52 overflow-hidden bg-muted/40">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name_en}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <Package className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                </div>

                                <CardContent className="space-y-3 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge variant="secondary" className="rounded-full text-[11px] uppercase tracking-[0.08em]">
                                            {product.category || 'General'}
                                        </Badge>
                                        <button
                                            type="button"
                                            onClick={() => setQuickViewProduct(product)}
                                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                            aria-label="Quick view product"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div>
                                        <h2 className="line-clamp-2 text-base font-semibold leading-tight transition-colors group-hover:text-primary">
                                            {product.name_en}
                                        </h2>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            From {product.origin_region || 'Afghanistan'}
                                        </p>
                                    </div>

                                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                        {product.description_en || 'Authentic Afghan product available for international buyers.'}
                                    </p>

                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-9 flex-1 rounded-full"
                                            onClick={() => setQuickViewProduct(product)}
                                        >
                                            Details
                                        </Button>
                                        <Button type="button" className="h-9 flex-1 rounded-full" onClick={() => addToCart(product)}>
                                            <Plus className="mr-1.5 h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Dialog open={Boolean(quickViewProduct)} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
                <DialogContent className="max-h-[92vh] w-[94vw] max-w-3xl overflow-y-auto rounded-2xl border-border/70 p-0">
                    {quickViewProduct && (
                        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                            <div className="h-72 bg-muted/40 md:h-full">
                                {quickViewProduct.image_url ? (
                                    <img
                                        src={quickViewProduct.image_url}
                                        alt={quickViewProduct.name_en}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <Package className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-5 p-6">
                                <div className="space-y-2">
                                    <Badge variant="secondary" className="rounded-full text-[11px] uppercase tracking-[0.08em]">
                                        {quickViewProduct.category || 'General'}
                                    </Badge>
                                    <DialogTitle className="text-2xl font-bold leading-tight">{quickViewProduct.name_en}</DialogTitle>
                                    <DialogDescription className="text-sm">From {quickViewProduct.origin_region || 'Afghanistan'}</DialogDescription>
                                </div>

                                <p className="text-sm leading-7 text-muted-foreground">
                                    {quickViewProduct.description_en || 'Authentic Afghan product available for global wholesale and retail buyers.'}
                                </p>

                                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order model</p>
                                    <p className="mt-2 text-sm leading-6 text-foreground">
                                        This store works on quote-based checkout. Add products to your cart and submit one order request.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        className="rounded-full px-6"
                                        onClick={() => {
                                            addToCart(quickViewProduct);
                                            setQuickViewProduct(null);
                                            setCartOpen(true);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add to cart
                                    </Button>
                                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setQuickViewProduct(null)}>
                                        Continue browsing
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                <DialogContent className="max-h-[95vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl border-border/70 p-0">
                    <div className="sticky top-0 z-10 border-b border-border/60 bg-background/95 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">Cart checkout</DialogTitle>
                                    <DialogDescription className="text-xs uppercase tracking-[0.12em]">
                                        {distinctItemCount} {distinctItemCount === 1 ? 'item' : 'items'} • {cartItemCount} units
                                    </DialogDescription>
                                </div>
                            </div>
                            {cartItems.length > 0 ? (
                                <Button type="button" variant="ghost" className="h-8 rounded-full px-3 text-xs" onClick={clearCart}>
                                    Clear cart
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-6 p-5 md:p-6">
                        {status.success && (
                            <Alert className="rounded-xl border-green-200 bg-green-50/80 text-green-900">
                                <CheckCircle className="h-5 w-5 shrink-0" />
                                <div className="ml-2">
                                    <AlertTitle className="font-semibold">Order request sent!</AlertTitle>
                                    <AlertDescription className="mt-1 text-sm">
                                        Thank you! Our team will contact you shortly to confirm details and arrange payment.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        )}

                        {status.error && (
                            <Alert className="rounded-xl border-red-200 bg-red-50/80 text-red-900">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <div className="ml-2">
                                    <AlertTitle className="font-semibold">Unable to submit</AlertTitle>
                                    <AlertDescription className="mt-1 text-sm">{status.error}</AlertDescription>
                                </div>
                            </Alert>
                        )}

                        {cartItems.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-border/70 p-10 text-center">
                                <ShoppingBag className="mx-auto mb-3 h-11 w-11 text-muted-foreground/50" />
                                <p className="font-medium text-muted-foreground">Your cart is empty</p>
                                <p className="mt-1 text-sm text-muted-foreground/70">Add products to prepare a request</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/80">Items</p>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-border/70 bg-muted/20 p-4"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">{item.name}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] text-primary"
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{item.origin}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-background p-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-full border-0"
                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </Button>
                                            <span className="min-w-7 text-center text-sm font-semibold">{item.quantity}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-full border-0"
                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/60 pt-6">
                                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/80">Buyer information</p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-sm font-medium text-foreground" htmlFor="name">
                                            Full name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={checkoutData.name}
                                            onChange={handleCheckoutChange}
                                            placeholder="Your name"
                                            className="h-10 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="text-sm font-medium text-foreground" htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={checkoutData.email}
                                            onChange={handleCheckoutChange}
                                            placeholder="your@email.com"
                                            className="h-10 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground" htmlFor="country">
                                            Country <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={checkoutData.country}
                                            onChange={handleCheckoutChange}
                                            placeholder="Afghanistan"
                                            className="h-10 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-foreground" htmlFor="company">
                                            Company <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={checkoutData.company}
                                            onChange={handleCheckoutChange}
                                            placeholder="Company name"
                                            className="h-10 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground" htmlFor="message">
                                        Order notes <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={checkoutData.message}
                                        onChange={handleCheckoutChange}
                                        rows={3}
                                        className="resize-none rounded-xl"
                                        placeholder="Packaging, delivery instructions, special requests..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={status.loading || cartItems.length === 0}
                                    className="h-11 w-full rounded-full text-sm font-semibold"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {status.loading ? 'Submitting request...' : 'Place order request'}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Payment is handled after order confirmation. Our team will contact you with details.
                                </p>
                            </form>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Products;
