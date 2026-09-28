import React, { useState, useEffect } from 'react';

const INITIAL_BURGERS = [
  {
    id: 101,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    badgeLevel: 'Nivel: Maestro Grill',
    badgeColor: '#f59e0b',
    price: 14.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus flameada a la leña de roble, queso cheddar añejo fundido, cebolla caramelizada al bourbon y panceta crocante.',
    prepTime: '15-20 min'
  },
  {
    id: 102,
    name: 'Hamburguesa Real',
    category: 'A la Parrilla',
    badgeLevel: 'Nivel: Esencial Smash',
    badgeColor: '#38bdf8',
    price: 11.50,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada Maillard perfecta, queso americano fundido, pepinillos agridulces y aderezo imperial.',
    prepTime: '12-15 min'
  },
  {
    id: 103,
    name: 'Hamburguesa Royal Crispy',
    category: 'Pollo Crispy',
    badgeLevel: 'Nivel: Especialista Crispy',
    badgeColor: '#ec4899',
    price: 12.99,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada en buttermilk 24h y 11 especias secretas, doble rebozado extra crocante, ensalada coleslaw fresca con manzana y emulsión honey mustard.',
    prepTime: '15-18 min'
  },
  {
    id: 104,
    name: 'HamburguesaDouble Whopper',
    category: 'Gigantes XXL',
    badgeLevel: 'Nivel: Master Chef XXL',
    badgeColor: '#10b981',
    price: 15.50,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón gigante a la parrilla de carbón vivo, lechuga romana, tomate maduro, aros de cebolla morada y salsa tártara artesanal.',
    prepTime: '20-25 min'
  }
];

const SPECIAL_OFFERS = [
  {
    id: 'off-1',
    title: 'Combo Dúo Parrilla 2x1',
    tag: '30% OFF',
    desc: '2x Rey de las Hamburguesas a la Parrilla + Porción XL de Papas Rústicas con Romero.',
    oldPrice: 34.90,
    price: 24.50,
    color: '#f59e0b',
    burgerId: 101,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-2',
    title: 'Crispy Box Fest',
    tag: 'COMBO POPULAR',
    desc: 'Hamburguesa Royal Crispy + Aros de Cebolla Tempura + Bebida Artesanal.',
    oldPrice: 19.50,
    price: 14.80,
    color: '#ec4899',
    burgerId: 103,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-3',
    title: 'Martes Smash Real',
    tag: 'OFERTA DEL DÍA',
    desc: 'Hamburguesa Real con Doble Cheddar Líquido y Papas Fritas Gratis.',
    oldPrice: 16.50,
    price: 11.50,
    color: '#38bdf8',
    burgerId: 102,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ofertas' | 'ordenes' | 'perfil'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Cart & Orders State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ncr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ncr_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'NCR-9402',
        date: 'Hoy, hace 15 min',
        status: 'En camino en delivery 🛵',
        step: 3,
        total: 26.49,
        address: 'Calle Los Robles 342, Miraflores',
        items: [
          { name: 'Rey de las hamburguesas a la parrilla', qty: 1, price: 14.99 },
          { name: 'Hamburguesa Real', qty: 1, price: 11.50 }
        ]
      }
    ];
  });

  // UI Modals
  const [selectedBurger, setSelectedBurger] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout form
  const [customerName, setCustomerName] = useState('Pablo Valdivia');
  const [deliveryAddress, setDeliveryAddress] = useState('Av. Javier Prado Este 2450');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple' | 'cash'

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('ncr_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ncr_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Online / offline & PWA install
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar esta PWA: En tu navegador selecciona "Instalar aplicación" o "Agregar a pantalla de inicio".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Cart Management
  const addToCart = (burger, extras = []) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === burger.id);
      if (existing) {
        return prev.map(item => item.id === burger.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...burger, qty: 1, extras }];
    });
    showToast(`¡${burger.name} agregada al carrito! 🍔`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const deliveryFee = cart.length > 0 ? 2.50 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cartSubtotal > 30 ? 0 : deliveryFee));

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'RAPID20') {
      setDiscountPercent(20);
      showToast('🎉 ¡Cupón RAPID20 aplicado: 20% de Descuento!');
    } else if (couponCode.trim().toUpperCase() === 'RAPIDFREE') {
      setDiscountPercent(15);
      showToast('🎉 ¡Cupón RAPIDFREE aplicado: 15% de Descuento!');
    } else {
      showToast('❌ Cupón no válido. Prueba con RAPID20');
    }
  };

  // Simulate Order Creation
  const handleConfirmOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `NCR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Recién ordenado',
      status: 'Recibido en Cocina 📋',
      step: 1,
      total: cartTotal,
      address: deliveryAddress,
      paymentMethod,
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('ordenes');
    showToast('🚀 ¡Simulación de orden completada con éxito!');
  };

  // Advance Order Step (Simulated live tracker)
  const advanceOrderStep = (orderId) => {
    const stepsText = [
      'Recibido en Cocina 📋',
      'En Parrilla a Leña 🥩',
      'En camino en delivery 🛵',
      'Entregado con Éxito 🎉'
    ];

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const nextStep = ord.step < 4 ? ord.step + 1 : 1;
        return {
          ...ord,
          step: nextStep,
          status: stepsText[nextStep - 1]
        };
      }
      return ord;
    }));
    showToast('⚡ Estado de la orden actualizado en tiempo real');
  };

  // Filter burgers
  const filteredBurgers = INITIAL_BURGERS.filter(b => {
    const matchCat = activeCategory === 'Todas' || b.category === activeCategory;
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #38bdf8',
          color: '#f8fafc',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '0.85rem',
          fontWeight: '700',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header style={{
        padding: '14px 18px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🍔</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'white', lineHeight: '1.2' }}>
              NextCollege <span style={{ color: '#f59e0b' }}>Rapid</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              PWA Mobile Simulator
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status pill */}
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '10px',
            fontWeight: '700',
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#10b981' : '#ef4444',
            border: isOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: 'white',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            🛒
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 85px' }} className="fade-in">
        
        {/* ============================================================== */}
        {/* TAB 1: MENU                                                   */}
        {/* ============================================================== */}
        {activeTab === 'menu' && (
          <div>
            {/* Promo Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b, #1e293b)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div>
                <span style={{ background: '#f59e0b', color: '#090d16', fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  Masterclass & Delivery
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginTop: '6px' }}>
                  Hamburguesas de Autor
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
                  Usa el cupón <strong style={{ color: '#38bdf8' }}>RAPID20</strong> para 20% OFF en tu compra simulada.
                </p>
              </div>
              <span style={{ fontSize: '2.5rem', marginLeft: '10px' }}>🔥</span>
            </div>

            {/* Search Box */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar hamburguesa o ingredientes..."
                style={{
                  width: '100%',
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {['Todas', 'A la Parrilla', 'Pollo Crispy', 'Gigantes XXL'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: activeCategory === cat ? '#2563eb' : '#131b2e',
                    border: `1px solid ${activeCategory === cat ? '#38bdf8' : '#1e293b'}`,
                    color: activeCategory === cat ? 'white' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredBurgers.map(burger => (
                <div
                  key={burger.id}
                  style={{
                    background: '#131b2e',
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ position: 'relative', height: '140px', background: '#000' }}>
                    <img
                      src={burger.image}
                      alt={burger.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: burger.badgeColor,
                      border: `1px solid ${burger.badgeColor}40`,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      {burger.badgeLevel}
                    </span>
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: '#fbbf24',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      ★ {burger.rating}
                    </span>
                  </div>

                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '800', lineHeight: '1.3' }}>
                        {burger.name}
                      </h4>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '12px' }}>
                      {burger.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#38bdf8' }}>
                          ${burger.price.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '4px' }}>USD</span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => setSelectedBurger(burger)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#94a3b8',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Detalles
                        </button>

                        <button
                          onClick={() => addToCart(burger)}
                          style={{
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            border: 'none',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>+</span> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: OFERTAS                                                */}
        {/* ============================================================== */}
        {activeTab === 'ofertas' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
                🏷️ Ofertas & Promociones
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Combos exclusivos con descuento para tu pedido rápido.
              </p>
            </div>

            {/* Coupons Card */}
            <div style={{
              background: '#131b2e',
              border: '1px dashed #38bdf8',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>
                Cupón Exclusivo de MasterClass
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white', letterSpacing: '0.05em' }}>
                  RAPID20
                </span>
                <button
                  onClick={() => {
                    setCouponCode('RAPID20');
                    setDiscountPercent(20);
                    showToast('¡Cupón RAPID20 copiado y aplicado! 🎉');
                  }}
                  style={{
                    background: '#2563eb',
                    border: 'none',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Canjear 20%
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Aplica a cualquier hamburguesa o combo en tu carrito.
              </div>
            </div>

            {/* Special Offers Grid */}
            <div style={{ display: 'grid', gap: '14px' }}>
              {SPECIAL_OFFERS.map(offer => (
                <div
                  key={offer.id}
                  style={{
                    background: '#131b2e',
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'relative', height: '120px', background: '#000' }}>
                    <img src={offer.image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: offer.color,
                      color: '#090d16',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '800'
                    }}>
                      {offer.tag}
                    </span>
                  </div>

                  <div style={{ padding: '14px' }}>
                    <h3 style={{ color: 'white', fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '12px' }}>
                      {offer.desc}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.8rem', marginRight: '6px' }}>
                          ${offer.oldPrice.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                          ${offer.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const base = INITIAL_BURGERS.find(b => b.id === offer.burgerId) || INITIAL_BURGERS[0];
                          addToCart({ ...base, name: offer.title, price: offer.price, id: Date.now() });
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: 'white',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Añadir Oferta
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ORDENES                                                */}
        {/* ============================================================== */}
        {activeTab === 'ordenes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
                  📦 Rastreo de Órdenes
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Simulador de pedidos en tiempo real.
                </p>
              </div>

              {orders.length > 0 && (
                <button
                  onClick={() => advanceOrderStep(orders[0].id)}
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Avanzar Paso
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#131b2e',
                borderRadius: '16px',
                border: '1px solid #1e293b'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🍔</div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '6px' }}>No tienes órdenes activas</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Selecciona alguna de nuestras 4 hamburguesas maestras y simula una compra.
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {orders.map((ord, idx) => (
                  <div
                    key={ord.id}
                    style={{
                      background: '#131b2e',
                      border: idx === 0 ? '1px solid #38bdf8' : '1px solid #1e293b',
                      borderRadius: '16px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>ORDEN</span>
                        <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '800' }}>{ord.id}</h4>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: ord.step === 4 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                        color: ord.step === 4 ? '#10b981' : '#38bdf8'
                      }}>
                        {ord.status}
                      </span>
                    </div>

                    {/* Progress Step Bar */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '6px' }}>
                        {[1, 2, 3, 4].map(s => (
                          <div
                            key={s}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: ord.step >= s ? '#2563eb' : '#1e293b',
                              border: `2px solid ${ord.step >= s ? '#38bdf8' : '#334155'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '800',
                              color: 'white',
                              zIndex: 2
                            }}
                          >
                            {ord.step > s ? '✓' : s}
                          </div>
                        ))}
                        {/* Connecting Line */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          right: '12px',
                          height: '2px',
                          background: '#1e293b',
                          zIndex: 1
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#94a3b8' }}>
                        <span>Cocina</span>
                        <span>Parrilla</span>
                        <span>Delivery</span>
                        <span>Listo</span>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', marginTop: '10px' }}>
                      {ord.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span>{it.qty}x {it.name}</span>
                          <span style={{ fontWeight: '700' }}>${(it.price * it.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px', marginTop: '10px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Entrega: {ord.address}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#38bdf8' }}>
                        Total: ${ord.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PERFIL                                                 */}
        {/* ============================================================== */}
        {activeTab === 'perfil' && (
          <div>
            {/* User Profile Header */}
            <div style={{
              background: '#131b2e',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '18px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #f59e0b)',
                margin: '0 auto 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                👨‍🍳
              </div>

              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '800' }}>{customerName}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>pablo@nextcollege.edu</p>

              <div style={{
                display: 'inline-block',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '800',
                marginTop: '10px'
              }}>
                👑 SOCIO VIP GOLD &bull; 850 PUNTOS
              </div>
            </div>

            {/* Consumption Metrics Card */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#38bdf8' }}>{orders.length + 8}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Hamburguesas Pedidas</div>
              </div>
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10b981' }}>$142.50</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Gasto Acumulado USD</div>
              </div>
            </div>

            {/* App Actions Links */}
            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
              <a
                href="/"
                style={{
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  fontWeight: '600'
                }}
              >
                <span>🌐 Ver Landing E-commerce</span>
                <span style={{ color: '#38bdf8' }}>&rarr;</span>
              </a>

              <a
                href="/admin"
                style={{
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.88rem',
                  fontWeight: '600'
                }}
              >
                <span>⚙️ Abrir Panel Administrativo</span>
                <span style={{ color: '#38bdf8' }}>&rarr;</span>
              </a>

              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  📲 Instalar App en Pantalla de Inicio
                </button>
              )}
            </div>

            {/* Reset simulator */}
            <button
              onClick={() => {
                localStorage.removeItem('ncr_orders');
                localStorage.removeItem('ncr_cart');
                setCart([]);
                setOrders([]);
                showToast('Datos del simulador reiniciados');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🔄 Reiniciar Historial del Simulador
            </button>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* BOTTOM NAVIGATION BAR                                         */}
      {/* ============================================================== */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        maxWidth: '500px',
        background: '#0b0f19',
        borderTop: '1px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '8px 0',
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        {[
          { key: 'menu', label: 'Menú', icon: '🍔' },
          { key: 'ofertas', label: 'Ofertas', icon: '🏷️' },
          { key: 'ordenes', label: 'Órdenes', icon: '📦', badge: orders.length },
          { key: 'perfil', label: 'Perfil', icon: '👤' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === tab.key ? '#38bdf8' : '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              position: 'relative',
              padding: '4px 0'
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: activeTab === tab.key ? '800' : '600' }}>
              {tab.label}
            </span>
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '25%',
                background: '#2563eb',
                color: 'white',
                fontSize: '0.62rem',
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '8px'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ============================================================== */}
      {/* MODAL: BURGER DETAIL & CUSTOMIZE                               */}
      {/* ============================================================== */}
      {selectedBurger && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
        onClick={() => setSelectedBurger(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111827',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '20px',
              borderTop: '1px solid #1f2937'
            }}
            className="pop-anim"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.72rem',
                color: selectedBurger.badgeColor,
                fontWeight: '800',
                background: selectedBurger.badgeColor + '20',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {selectedBurger.badgeLevel}
              </span>
              <button
                onClick={() => setSelectedBurger(null)}
                style={{ background: '#1f2937', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <img
              src={selectedBurger.image}
              alt={selectedBurger.name}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }}
            />

            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>
              {selectedBurger.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
              {selectedBurger.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#38bdf8' }}>
                ${selectedBurger.price.toFixed(2)} USD
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ⏱️ Tiempo est.: {selectedBurger.prepTime}
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(selectedBurger);
                setSelectedBurger(null);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🍔 Agregar al Carrito (${selectedBurger.price.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DRAWER / MODAL: CART & CHECKOUT SIMULATOR                     */}
      {/* ============================================================== */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
        onClick={() => setIsCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111827',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '20px',
              borderTop: '1px solid #1f2937'
            }}
            className="pop-anim"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem' }}>🛒</span>
                <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '800' }}>Tu Carrito de Pedido</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: '#1f2937', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🛒</div>
                <p>El carrito está vacío.</p>
              </div>
            ) : (
              <div>
                {/* Cart Items List */}
                <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                  {cart.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: '#131b2e',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: '10px' }}>
                        <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: '700' }}>
                          {item.name}
                        </div>
                        <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: '800' }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: 'white',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '800'
                          }}
                        >
                          -
                        </button>
                        <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          style={{
                            background: '#2563eb',
                            border: 'none',
                            color: 'white',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '800'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Código (Ej: RAPID20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      background: '#131b2e',
                      border: '1px solid #1e293b',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: 'white',
                      fontSize: '0.82rem',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      background: '#38bdf8',
                      color: '#090d16',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Aplicar
                  </button>
                </div>

                {/* Simulated Delivery & Payment info */}
                <div style={{ background: '#131b2e', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0b0f19',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      color: 'white',
                      fontSize: '0.8rem',
                      marginBottom: '8px'
                    }}
                  />

                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Método de Pago
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      { key: 'card', label: '💳 Tarjeta' },
                      { key: 'apple', label: '📱 Apple Pay' },
                      { key: 'cash', label: '💵 Efectivo' }
                    ].map(m => (
                      <button
                        key={m.key}
                        onClick={() => setPaymentMethod(m.key)}
                        style={{
                          background: paymentMethod === m.key ? '#2563eb' : '#0b0f19',
                          border: `1px solid ${paymentMethod === m.key ? '#38bdf8' : '#1e293b'}`,
                          color: 'white',
                          padding: '6px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>Subtotal:</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#10b981', marginBottom: '4px' }}>
                      <span>Descuento ({discountPercent}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                    <span>Costo de Envío:</span>
                    <span>{cartSubtotal > 30 ? 'GRATIS' : `$${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900', color: 'white', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
                    <span>Total a Pagar:</span>
                    <span style={{ color: '#38bdf8' }}>${cartTotal.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Confirm order CTA */}
                <button
                  onClick={handleConfirmOrder}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  🚀 Confirmar y Simular Compra (${cartTotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
