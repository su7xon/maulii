import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MobilesView } from './components/MobilesView';
import { HeroBanners } from './components/HeroBanners';
import { LandingHero } from './components/LandingHero';
import { TrustBar } from './components/TrustBar';
import { DealsCountdown } from './components/DealsCountdown';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { CartDrawer } from './components/CartDrawer';
import { PincodeModal } from './components/PincodeModal';
import { BottomNav } from './components/BottomNav';
import { CategoriesView } from './components/CategoriesView';
import { DealsView } from './components/DealsView';
import { CheckoutView } from './components/CheckoutView';
import { ProfileView, SavedAddress } from './components/ProfileView';
import { ChatBot } from './components/ChatBot';
import { Footer } from './components/Footer';
import { HelpPaymentStrip } from './components/HelpPaymentStrip';
import { Toast } from './components/Toast';
import { SortDropdown } from './components/SortDropdown';
import { RecentlyViewed } from './components/RecentlyViewed';
import { PRODUCTS, CATEGORIES, BEST_SELLING_PHONES, MIDNIGHT_DISCOUNT_PHONES, BANK_OFFERS, BANNERS, NEW_LAUNCHES, NewLaunchItem } from './data/mockData';
import { LANDING_SLIDES, LandingSlide } from './components/LandingHero';
import { Product, CartItem, FilterState, Category, Banner, BankOffer } from './types';
import { AdminPanel } from './components/AdminPanel';
import {
  loadProducts, saveProducts, loadCategories, saveCategories,
  loadBanners, saveBanners, loadOffers, saveOffers,
  loadLaunches, saveLaunches, loadSlides, saveSlides,
  loadOrders, saveOrders, resetAllAdmin, Order,
  sanitizeSlides, sanitizeBanners, sanitizeLaunches, sanitizeCategories,
  fixProductImages, fixImageUrl,
} from './data/adminStore';
import { fetchCloudStore, saveCloudKey } from './lib/cloudStore';
import { dedupeToRepresentatives } from './lib/variants';

// Full searchable catalog: grid products + carousel phones (dedupe by id)
const DEFAULT_CATALOG: Product[] = Array.from(
  new Map(
    [...PRODUCTS, ...BEST_SELLING_PHONES, ...MIDNIGHT_DISCOUNT_PHONES].map((p) => [p.id, p])
  ).values()
);

export default function App() {
  // ---- Admin-controlled catalog (localStorage overrides, editable via Admin Panel) ----
  const [adminProducts, setAdminProducts] = useState<Product[]>(() => loadProducts());
  const [adminCategories, setAdminCategories] = useState<Category[]>(() => loadCategories());
  const [adminBanners, setAdminBanners] = useState<Banner[]>(() => loadBanners());
  const [adminOffers, setAdminOffers] = useState<BankOffer[]>(() => loadOffers());
  const [adminLaunches, setAdminLaunches] = useState<NewLaunchItem[]>(() => loadLaunches());
  const [adminSlides, setAdminSlides] = useState<LandingSlide[]>(() => loadSlides());
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [cloudReady, setCloudReady] = useState(false);

  // Shared Firestore read: sab visitors ko same images/products dikhe
  useEffect(() => {
    let live = true;
    fetchCloudStore()
      .then((cloud) => {
        if (!cloud || !live) return;
        if (Array.isArray(cloud.products) && cloud.products.length > 0)
          setAdminProducts(fixProductImages(cloud.products as Product[]));
        if (Array.isArray(cloud.categories) && cloud.categories.length > 0)
          setAdminCategories(sanitizeCategories(cloud.categories));
        if (Array.isArray(cloud.banners) && cloud.banners.length > 0)
          setAdminBanners(sanitizeBanners(cloud.banners));
        if (Array.isArray(cloud.offers) && cloud.offers.length > 0)
          setAdminOffers(cloud.offers as BankOffer[]);
        if (Array.isArray(cloud.launches) && cloud.launches.length > 0)
          setAdminLaunches(sanitizeLaunches(cloud.launches));
        if (Array.isArray(cloud.slides) && cloud.slides.length > 0)
          setAdminSlides(sanitizeSlides(cloud.slides));
        setCloudReady(true);
      })
      .catch(() => {
        if (live) setCloudReady(true);
      });
    return () => {
      live = false;
    };
  }, []);
  void cloudReady;
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      // Admin sirf /admin URL se khulta hai (koi button/icon nahi)
      if (window.location.pathname === '/admin') return true;
      return new URLSearchParams(window.location.search).get('admin') !== null;
    } catch {
      return false;
    }
  });

  const ALL_PRODUCTS: Product[] = useMemo(
    () => (adminProducts.length > 0 ? adminProducts : DEFAULT_CATALOG),
    [adminProducts]
  );

  // Curated carousels follow original merchandising ids; admin edits apply, new items surface via search/grid/deals
  const BEST_IDS = useMemo(() => new Set(BEST_SELLING_PHONES.map((p) => p.id)), []);
  const MID_IDS = useMemo(() => new Set(MIDNIGHT_DISCOUNT_PHONES.map((p) => p.id)), []);
  const bestSellers = useMemo(() => {
    const l = ALL_PRODUCTS.filter((p) => BEST_IDS.has(p.id));
    return l.length > 0 ? l : ALL_PRODUCTS.slice(0, 6);
  }, [ALL_PRODUCTS, BEST_IDS]);
  const midnightPhones = useMemo(() => {
    const l = ALL_PRODUCTS.filter((p) => MID_IDS.has(p.id));
    return l.length > 0 ? l : ALL_PRODUCTS.slice(6, 12);
  }, [ALL_PRODUCTS, MID_IDS]);

  const closeAdmin = () => {
    setIsAdmin(false);
    try {
      window.history.pushState({}, '', '/');
    } catch { /* noop */ }
    window.scrollTo({ top: 0 });
  };
  const handleResetAll = () => {
    resetAllAdmin();
    setAdminProducts(PRODUCTS);
    setAdminCategories(CATEGORIES);
    setAdminBanners(BANNERS);
    setAdminOffers(BANK_OFFERS);
    setAdminLaunches(NEW_LAUNCHES);
    setAdminSlides(LANDING_SLIDES);
    // Defaults cloud me bhi push — sab visitors pe reset lage
    void saveCloudKey('mm_admin_products', 'products', PRODUCTS);
    void saveCloudKey('mm_admin_categories', 'categories', CATEGORIES);
    void saveCloudKey('mm_admin_banners', 'banners', BANNERS);
    void saveCloudKey('mm_admin_offers', 'offers', BANK_OFFERS);
    void saveCloudKey('mm_admin_launches', 'launches', NEW_LAUNCHES);
    void saveCloudKey('mm_admin_slides', 'slides', LANDING_SLIDES);
  };

  // Navigation & View States - default to 'mobiles' as requested in reference screenshots
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'deals' | 'cart' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('mobiles');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Location / Pincode
  const [currentCity, setCurrentCity] = useState<string>('Mumbai');
  const [currentPincode, setCurrentPincode] = useState<string>('400001');

  // Modals & Drawers
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      const id = new URLSearchParams(window.location.search).get('product');
      return (id && ALL_PRODUCTS.find((p) => p.id === id)) || null;
    } catch {
      return null;
    }
  });

  // Open product as full page: shareable URL + scroll top
  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setRecentIds((prev) => {
      const next = [p.id, ...prev.filter((id) => id !== p.id)].slice(0, 10);
      try {
        localStorage.setItem('mm_recently_viewed', JSON.stringify(next));
      } catch { /* noop */ }
      return next;
    });
    try {
      window.history.pushState({ productId: p.id }, '', `?product=${p.id}`);
    } catch { /* noop */ }
    window.scrollTo({ top: 0 });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    try {
      window.history.pushState({}, '', window.location.pathname);
    } catch { /* noop */ }
    window.scrollTo({ top: 0 });
  };

  // Browser back/forward restores product page + /admin route
  useEffect(() => {
    const onPop = () => {
      try {
        if (window.location.pathname === '/admin') {
          setOrders(loadOrders());
          setIsAdmin(true);
          return;
        }
        if (new URLSearchParams(window.location.search).get('admin') !== null) {
          setIsAdmin(true);
          return;
        }
        setIsAdmin(false);
        const id = new URLSearchParams(window.location.search).get('product');
        setSelectedProduct((id && loadProducts().find((p) => p.id === id)) || null);
        window.scrollTo({ top: 0 });
      } catch { /* noop */ }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'cart' | 'info' } | null>(null);

  // Cart with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const fallback = [
      { product: adminProducts[0] || PRODUCTS[0], quantity: 1, selectedWarranty: false },
      { product: adminProducts[1] || PRODUCTS[1], quantity: 1, selectedWarranty: false },
    ];
    try {
      const saved = localStorage.getItem('rd_cart');
      if (!saved) return fallback;
      const parsed = JSON.parse(saved) as CartItem[];
      if (!Array.isArray(parsed)) return fallback;
      return parsed.map((it) =>
        it?.product ? { ...it, product: { ...it.product, image: fixImageUrl(it.product.image, it.product.id) } } : it
      );
    } catch {
      return fallback;
    }
  });

  // Recently viewed (persisted, max 10)
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('mm_recently_viewed');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string').slice(0, 10) : [];
    } catch {
      return [];
    }
  });

  // Filters & Sorting
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 200000,
    sortBy: 'popularity',
    expressOnly: false,
  });

  // Browse mode: force the product grid (used by brand/category tiles,
  // so every click lands on a product listing instead of an empty view)
  const [browseMode, setBrowseMode] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rd_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'cart' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Cart Actions
  const handleAddToCart = (product: Product, withWarranty: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, selectedWarranty: withWarranty || item.selectedWarranty }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedWarranty: withWarranty }];
    });
    showToast(`Added ${product.name.slice(0, 24)}... to Cart`, 'cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleToggleWarranty = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, selectedWarranty: !item.selectedWarranty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleClearRecent = () => {
    setRecentIds([]);
    try {
      localStorage.removeItem('mm_recently_viewed');
    } catch { /* noop */ }
  };

  // Buy Now Action → straight to Flipkart-style checkout page
  const handleBuyNow = (product: Product, withWarranty: boolean = false) => {
    handleAddToCart(product, withWarranty);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    window.scrollTo({ top: 0 });
  };

  // Buy Again from profile → re-add order items that still exist in catalog
  const handleBuyAgain = (order: Order) => {
    let added = 0;
    order.items.forEach((it) => {
      const p = ALL_PRODUCTS.find((x) => x.id === it.id);
      if (p) {
        for (let i = 0; i < it.quantity; i++) handleAddToCart(p);
        added += it.quantity;
      }
    });
    if (added > 0) {
      setIsCartOpen(true);
    } else {
      showToast('Those items are no longer available', 'info');
    }
  };

  // Use a saved profile address as delivery location
  const handleUseAddress = (a: SavedAddress) => {
    setCurrentCity(a.city);
    setCurrentPincode(a.pincode);
    try {
      const { id, isDefault, ...rest } = a;
      void id; void isDefault;
      localStorage.setItem('mm_address', JSON.stringify(rest));
    } catch { /* noop */ }
    showToast(`Delivery location set to ${a.city} (${a.pincode})`, 'info');
  };

  // Cart drawer → checkout page
  const handleGoCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    window.scrollTo({ top: 0 });
  };

  // Order done → back to fresh home
  const handleOrderDone = () => {
    setIsCheckoutOpen(false);
    setOrders(loadOrders());
    handleCloseProduct();
    setSearchQuery('');
    setFilter((prev) => ({ ...prev, brand: 'all' }));
    setSelectedCategory('mobiles');
    setBrowseMode(false);
    setActiveTab('home');
    window.scrollTo({ top: 0 });
  };

  // Brand tile click → brand-filtered product grid.
  // Brands with no products fall back to all mobiles + info toast,
  // so the click always opens products instead of an empty page.
  const handleBrandTile = (brand: string) => {
    if (brand === 'all') {
      setFilter((prev) => ({ ...prev, brand: 'all' }));
      setBrowseMode(false);
    } else {
      const hasProducts = ALL_PRODUCTS.some(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
      if (hasProducts) {
        setFilter((prev) => ({ ...prev, brand }));
      } else {
        setFilter((prev) => ({ ...prev, brand: 'all' }));
        setSelectedCategory('mobiles');
        showToast(`No ${brand} products yet — showing all mobiles`, 'info');
      }
      setBrowseMode(true);
    }
    setActiveTab('home');
    window.scrollTo({ top: 0 });
  };

  // Category tile click → category product grid.
  // Empty categories fall back to all electronics + info toast.
  const handleCategoryTile = (cat: string) => {
    const hasProducts = ALL_PRODUCTS.some((p) => p.category === cat);
    if (hasProducts) {
      setSelectedCategory(cat);
      setFilter((prev) => ({ ...prev, brand: 'all' }));
    } else {
      const label = adminCategories.find((c) => c.id === cat)?.name || cat;
      setSelectedCategory('all');
      setFilter((prev) => ({ ...prev, brand: 'all' }));
      showToast(`No products in ${label} yet — showing all electronics`, 'info');
    }
    setBrowseMode(true);
    setActiveTab('home');
    window.scrollTo({ top: 0 });
  };

  // Filtered and Sorted Products (search runs across full catalog)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = ALL_PRODUCTS.filter((p) => {
      // Category filter (skipped while searching — Amazon-like global search)
      if (q === '' && selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (q !== '') {
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Brand filter
      if (filter.brand !== 'all' && p.brand.toLowerCase() !== filter.brand.toLowerCase()) {
        return false;
      }
      // Express delivery filter
      if (filter.expressOnly && !p.expressDelivery) {
        return false;
      }
      // Price range
      if (p.price < filter.minPrice || p.price > filter.maxPrice) {
        return false;
      }
      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (filter.sortBy === 'price-low') return a.price - b.price;
      if (filter.sortBy === 'price-high') return b.price - a.price;
      if (filter.sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      return b.ratingCount - a.ratingCount; // Popularity default
    });

    return list;
  }, [selectedCategory, searchQuery, filter]);

  const cartProductIds = useMemo(() => cart.map((c) => c.product.id), [cart]);

  // Grid shows 1 card per model (variants grouped, cheapest rep first)
  const groupedProducts = useMemo(
    () => dedupeToRepresentatives(filteredProducts),
    [filteredProducts]
  );

  const recentProducts = useMemo(() => {
    const map = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));
    return recentIds.map((id) => map.get(id)).filter((p): p is Product => Boolean(p));
  }, [recentIds, ALL_PRODUCTS]);

  // ---- Admin Panel takes over full screen (?admin=1 or shield button) ----
  if (isAdmin) {
    return (
      <AdminPanel
        products={adminProducts}
        categories={adminCategories}
        banners={adminBanners}
        offers={adminOffers}
        launches={adminLaunches}
        slides={adminSlides}
        orders={orders}
        onSaveProducts={(v) => { setAdminProducts(v); saveProducts(v); void saveCloudKey('mm_admin_products', 'products', v); }}
        onSaveCategories={(v) => { setAdminCategories(v); saveCategories(v); void saveCloudKey('mm_admin_categories', 'categories', v); }}
        onSaveBanners={(v) => { setAdminBanners(v); saveBanners(v); void saveCloudKey('mm_admin_banners', 'banners', v); }}
        onSaveOffers={(v) => { setAdminOffers(v); saveOffers(v); void saveCloudKey('mm_admin_offers', 'offers', v); }}
        onSaveLaunches={(v) => { setAdminLaunches(v); saveLaunches(v); void saveCloudKey('mm_admin_launches', 'launches', v); }}
        onSaveSlides={(v) => { setAdminSlides(v); saveSlides(v); void saveCloudKey('mm_admin_slides', 'slides', v); }}
        onSaveOrders={(v) => { setOrders(v); saveOrders(v); }}
        onResetAll={handleResetAll}
        onClose={closeAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#1a1a1a] flex flex-col selection:bg-[#e42529] selection:text-white pb-16 md:pb-0">
      
      {/* Top Header */}
      <Header
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onOpenPincodeModal={() => setIsPincodeModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectProduct={(p) => handleSelectProduct(p)}
        allProducts={ALL_PRODUCTS}
        onNavigateTab={(tab) => {
          if (tab === 'cart') {
            setIsCartOpen(true);
          } else if (tab === 'home') {
            // Logo click: full home reset (close product page, clear search/filters)
            handleCloseProduct();
            setSearchQuery('');
            setFilter((prev) => ({ ...prev, brand: 'all' }));
            setSelectedCategory('mobiles');
            setBrowseMode(false);
            setActiveTab('home');
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* View Router — checkout & product pages take over like Flipkart PDP */}
      <main className="flex-1">
        {isCheckoutOpen ? (
          <CheckoutView
            cartItems={cart}
            defaultCity={currentCity}
            defaultPincode={currentPincode}
            onBack={() => {
              setIsCheckoutOpen(false);
              window.scrollTo({ top: 0 });
            }}
            onOrderDone={handleOrderDone}
            onClearCart={handleClearCart}
          />
        ) : selectedProduct ? (
          <ProductPage
            product={selectedProduct}
            allProducts={ALL_PRODUCTS}
            offers={adminOffers}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onViewProduct={(p) => handleSelectProduct(p)}
            onBack={handleCloseProduct}
            onHome={() => {
              handleCloseProduct();
              setSelectedCategory('mobiles');
              setFilter((prev) => ({ ...prev, brand: 'all' }));
              setBrowseMode(false);
              setActiveTab('home');
            }}
            currentPincode={currentPincode}
            currentCity={currentCity}
            onOpenPincodeModal={() => setIsPincodeModalOpen(true)}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesView
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              setActiveTab('home');
            }}
            products={ALL_PRODUCTS}
            categories={adminCategories}
            onViewProduct={(p) => handleSelectProduct(p)}
          />
        ) : activeTab === 'deals' ? (
          <DealsView
            products={ALL_PRODUCTS}
            offers={adminOffers}
            cartProductIds={cartProductIds}
            onAddToCart={handleAddToCart}
            onViewProduct={(p) => handleSelectProduct(p)}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView
            orders={orders}
            onShopNow={() => {
              setSelectedCategory('mobiles');
              setBrowseMode(false);
              setActiveTab('home');
              window.scrollTo({ top: 0 });
            }}
            onBuyAgain={handleBuyAgain}
            onUseAddress={handleUseAddress}
            onNotify={(m) => showToast(m, 'info')}
          />
        ) : (
          /* Home Tab */
          <div>
            {/* If Mobiles category is active without search, brand filter & browse mode, show exact screenshots view */}
            {selectedCategory === 'mobiles' && !searchQuery && filter.brand === 'all' && !browseMode ? (
              <MobilesView
                cartProductIds={cartProductIds}
                onAddToCart={handleAddToCart}
                onViewProduct={(p) => handleSelectProduct(p)}
                onSelectBrand={handleBrandTile}
                onSelectCategory={handleCategoryTile}
                selectedCategory={selectedCategory}
                onGoToDeals={() => setActiveTab('deals')}
                launches={adminLaunches}
                slides={adminSlides}
                categories={adminCategories}
                bestSellers={bestSellers}
                midnightPhones={midnightPhones}
              />
            ) : (
              /* Filtered / Other Categories View */
              <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 space-y-4">
                {/* Promotional Hero Banners (Shown when exploring all products) */}
                {!searchQuery && selectedCategory === 'all' && (
                  <>
                    <LandingHero slides={adminSlides} />
                    <HeroBanners banners={adminBanners} />
                    <TrustBar />
                    <DealsCountdown />
                  </>
                )}

                {/* Sort control (Amazon-style, right aligned) */}
                <div className="flex justify-end">
                  <SortDropdown
                    sortBy={filter.sortBy}
                    onChange={(v) => setFilter((prev) => ({ ...prev, sortBy: v }))}
                  />
                </div>

                {/* Products Grid — 1 card per model, variants on PDP */}
                <div>
                  {groupedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                      {groupedProducts.map(({ rep: product, count }) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          variantCount={count}
                          isInCart={cartProductIds.includes(product.id)}
                          onAddToCart={handleAddToCart}
                          onViewProduct={(p) => handleSelectProduct(p)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-10 text-center border border-gray-200 my-6 max-w-md mx-auto">
                      <p className="text-base font-bold text-gray-800">No electronics found</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try resetting your filters or search query.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('mobiles');
                          setSearchQuery('');
                          setBrowseMode(false);
                          setFilter({
                            category: 'all',
                            brand: 'all',
                            minPrice: 0,
                            maxPrice: 200000,
                            sortBy: 'popularity',
                            expressOnly: false,
                          });
                        }}
                        className="mt-4 bg-[#e42529] hover:bg-[#c21418] text-white px-5 py-2 rounded-lg text-xs font-bold shadow transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Recently viewed rail — home tab only */}
            {!selectedProduct && !isCheckoutOpen && (
              <div className="pb-4">
                <RecentlyViewed
                  products={recentProducts}
                  cartProductIds={cartProductIds}
                  onAddToCart={handleAddToCart}
                  onViewProduct={(p) => handleSelectProduct(p)}
                  onClear={handleClearRecent}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Help / Payment / EMI info strip — home page only (not profile) */}
      {!selectedProduct && !isCheckoutOpen && activeTab !== 'profile' && <HelpPaymentStrip />}

      {/* Full Mauli Mobile Desktop & Mobile Footer — home/browse only, not on product, checkout & profile pages */}
      {!selectedProduct && !isCheckoutOpen && activeTab !== 'profile' && <Footer />}

      {/* Fixed Mobile Bottom Navigation (hidden on PDP — sticky buy bar lives there — and checkout) */}
      {!selectedProduct && !isCheckoutOpen && (
      <div className="md:hidden">
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'cart') {
              setIsCartOpen(true);
            } else {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        />
      </div>
      )}

      {/* WhatsApp chat float — home/browse only (product page gets AI chatbot instead) */}
      {!isCheckoutOpen && !selectedProduct && (
      <a
        href="https://wa.me/918237305111?text=Hi%20Mauli%20Mobile!%20I%20need%20information%20about%20mobiles."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-[52px] h-[52px] rounded-full bg-[#25D366] hover:bg-[#1eb856] text-white flex items-center justify-center shadow-[0_10px_30px_-6px_rgb(37_211_102/0.7)] hover:scale-110 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 448 512" className="w-7 h-7 fill-current" aria-hidden="true">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 2.1-4.2 1.1-7.9-.4-10.7-1.5-2.8-12.5-30.1-17.1-41-4.4-10.8-8.9-9.3-12.5-9.5-3.1-.2-6.7-.2-10.3-.2-3.6 0-9.5 1.4-14.4 6.7-5 5.3-19 18.6-19 45.4 0 26.8 19.5 52.6 22.2 56.3 2.8 3.7 38.4 58.6 93.1 82.2 13 5.6 23.2 9 31.1 11.5 13.1 4.2 25 3.6 34.4 2.2 10.5-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.4-5-3.7-10.5-6.5z" />
        </svg>
      </a>
      )}

      {/* AI chatbot — only on product page (replaces WhatsApp float there) */}
      {selectedProduct && !isCheckoutOpen && (
        <ChatBot
          product={selectedProduct}
          products={ALL_PRODUCTS}
          onViewProduct={(p) => handleSelectProduct(p)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleWarranty={handleToggleWarranty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleGoCheckout}
        currentCity={currentCity}
        currentPincode={currentPincode}
      />

      {/* Pincode & City Selection Modal */}
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        currentPincode={currentPincode}
        currentCity={currentCity}
        onSelectLocation={(city, pin) => {
          setCurrentCity(city);
          setCurrentPincode(pin);
          showToast(`Delivery location set to ${city} (${pin})`, 'info');
        }}
      />

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
