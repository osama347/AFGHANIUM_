import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertCircle,
    CheckCircle,
    Filter,
    Minus,
    Package,
    Plus,
    Search,
    Send,
    ShoppingBag,
    ShoppingCart,
    SortAsc,
    Trash2,
    X,
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
import { Textarea } from '../components/ui/FormElements';

const Products = () => {
    const { getActive, loading } = useProduct();

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [status, setStatus] = useState({ loading: false, error: null, success: false });
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        email: '',
        country: '',
        company: '',
        message: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const result = await getActive();
        if (result.success) {
            setProducts(result.data || []);
        }
    };

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
                    category: product.category || 'General',
                    origin: product.origin_region || 'Afghanistan',
                    image: product.image_url || '',
                    quantity: 1,
                },
            ];
        });

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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground">
            {/* Premium Header */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm">
                <div className="container-custom flex h-20 items-center justify-between">
                    <Link to="/shop" className="flex items-center gap-3 group">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                            <img src="/logo.jpg" alt="AFGHANIUM" className="h-9 w-9 rounded-lg object-cover" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-display text-lg font-bold tracking-wide text-foreground">AFGHANIUM</span>
                            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Shop</span>
                        </div>
                    </Link>

                    <Button
                        type="button"
                        variant="default"
                        className="relative rounded-full px-6 h-11 shadow-md hover:shadow-lg transition-all group"
                        onClick={() => setCartOpen(true)}
                    >
                        <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Cart</span>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-lg animate-pulse">
                                {cartItemCount}
                            </span>
                        )}
                    </Button>
                </div>
            </header>

            <main className="container-custom py-10">
                {/* Controls Section */}
                <div className="mb-10">
                    <div className="mb-6 grid gap-4 grid-cols-1 items-end md:grid-cols-12 lg:gap-5">
                        {/* Search */}
                        <div className="relative md:col-span-5 lg:col-span-5">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by name, origin, or category..."
                                className="pl-12 h-12 text-base rounded-xl border-border/60 focus:border-primary/50 transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative md:col-span-3 lg:col-span-3">
                            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                className="flex h-12 w-full rounded-xl border border-border/60 bg-background px-4 pl-12 py-3 text-base appearance-none focus:border-primary/50 focus:outline-none transition-colors cursor-pointer"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? '✓ All categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative md:col-span-2 lg:col-span-2">
                            <SortAsc className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="flex h-12 w-full rounded-xl border border-border/60 bg-background px-4 pl-12 py-3 text-base appearance-none focus:border-primary/50 focus:outline-none transition-colors cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="name_asc">A → Z</option>
                                <option value="name_desc">Z → A</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        {(searchTerm || selectedCategory !== 'all' || sortBy !== 'featured') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('featured');
                                }}
                                className="md:col-span-2 lg:col-span-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-xl hover:bg-muted/50"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-semibold">
                            {filteredProducts.length} products
                        </Badge>
                        {cartItemCount > 0 && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 font-semibold animate-pulse">
                                {cartItemCount} in cart
                            </Badge>
                        )}
                        {(searchTerm || selectedCategory !== 'all') && (
                            <span className="text-xs text-muted-foreground italic">Filtered results</span>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader size="lg" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <Card className="border-border/40 bg-muted/30 shadow-none">
                        <CardContent className="p-16 text-center">
                            <div className="flex justify-center mb-4">
                                <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground mb-2">No products found</h2>
                            <p className="text-muted-foreground mb-6">
                                {searchTerm ? `No results for "${searchTerm}".` : 'Try adjusting your filters.'}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('featured');
                                }}
                            >
                                Clear filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden border-border/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 bg-card/60 backdrop-blur-sm"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name_en}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <Package className="h-12 w-12 opacity-50" />
                                        </div>
                                    )}
                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                <CardContent className="space-y-4 p-5">
                                    {/* Category Badge */}
                                    <div className="flex items-start justify-between gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] font-bold bg-primary/15 text-primary border-0"
                                        >
                                            {product.category || 'General'}
                                        </Badge>
                                    </div>

                                    {/* Product Name */}
                                    <div>
                                        <h2 className="text-base font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                            {product.name_en}
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                                            From <span className="font-semibold text-foreground/80">{product.origin_region || 'Afghanistan'}</span>
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                        {product.description_en || 'Authentic Afghan product available for international buyers.'}
                                    </p>

                                    {/* Add to Cart Button */}
                                    <Button
                                        onClick={() => addToCart(product)}
                                        className="w-full rounded-lg h-10 font-semibold shadow-md hover:shadow-lg transition-all group/btn"
                                    >
                                        <Plus className="mr-2 h-4 w-4 group-hover/btn:scale-125 transition-transform" />
                                        Add to cart
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Enhanced Cart Dialog */}
            <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto p-0 rounded-2xl">
                    {/* Dialog Header */}
                    <div className="sticky top-0 z-10 border-b border-border/40 bg-gradient-to-r from-background via-background to-muted/20 p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">Shopping Cart</DialogTitle>
                                    <DialogDescription className="text-xs">
                                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • Total: {cartItemCount} units
                                    </DialogDescription>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCartOpen(false)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Dialog Content */}
                    <div className="p-6 space-y-6">
                        {/* Alerts */}
                        {status.success && (
                            <Alert className="border-green-200 bg-green-50/80 text-green-900 backdrop-blur-sm rounded-xl">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <div className="ml-3">
                                    <AlertTitle className="font-semibold">Order request sent!</AlertTitle>
                                    <AlertDescription className="text-sm mt-1">
                                        Thank you! Our team will contact you shortly to confirm details and arrange payment.
                                    </AlertDescription>
                                </div>
                            </Alert>
                        )}

                        {status.error && (
                            <Alert className="border-red-200 bg-red-50/80 text-red-900 backdrop-blur-sm rounded-xl">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <div className="ml-3">
                                    <AlertTitle className="font-semibold">Unable to submit</AlertTitle>
                                    <AlertDescription className="text-sm mt-1">{status.error}</AlertDescription>
                                </div>
                            </Alert>
                        )}

                        {/* Cart Items */}
                        {cartItems.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-border/60 p-10 text-center">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                                <p className="text-muted-foreground font-medium">Your cart is empty</p>
                                <p className="text-sm text-muted-foreground/70 mt-1">Add products to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Items in cart</p>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group/item rounded-xl border border-border/40 bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[11px] rounded-full px-2 py-0.5 border-primary/30 bg-primary/5 text-primary"
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{item.origin}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 bg-background/50 p-3 rounded-lg w-fit">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="min-w-8 text-center font-bold text-lg">{item.quantity}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Checkout Form */}
                        {cartItems.length > 0 && (
                            <form onSubmit={handleSubmit} className="border-t border-border/40 pt-6 space-y-4">
                                <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Buyer information</p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-semibold text-foreground" htmlFor="name">
                                            Full name <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={checkoutData.name}
                                            onChange={handleCheckoutChange}
                                            placeholder="Your name"
                                            className="h-11 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-semibold text-foreground" htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={checkoutData.email}
                                            onChange={handleCheckoutChange}
                                            placeholder="your@email.com"
                                            className="h-11 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground" htmlFor="country">
                                            Country <span className="text-destructive">*</span>
                                        </label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={checkoutData.country}
                                            onChange={handleCheckoutChange}
                                            placeholder="Afghanistan"
                                            className="h-11 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground" htmlFor="company">
                                            Company <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                                        </label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={checkoutData.company}
                                            onChange={handleCheckoutChange}
                                            placeholder="Company name"
                                            className="h-11 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground" htmlFor="message">
                                        Order notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={checkoutData.message}
                                        onChange={handleCheckoutChange}
                                        rows={3}
                                        className="resize-none rounded-lg"
                                        placeholder="Packaging, delivery instructions, special requests..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={status.loading || cartItems.length === 0}
                                    className="w-full h-12 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Send className="mr-2 h-5 w-5" />
                                    {status.loading ? 'Submitting request...' : 'Place order request'}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center italic">
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
