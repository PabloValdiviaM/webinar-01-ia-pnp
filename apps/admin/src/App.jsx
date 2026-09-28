import React, { useState, useEffect } from 'react';

// Fallback products if API not reached
const FALLBACK_BURGERS = [
  {
    id: 101,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    price: 14.99,
    stock: 45,
    sales: 680,
    badgeLevel: 'Nivel: Maestro Grill',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus flameada a la leña de roble, queso cheddar añejo fundido, cebolla caramelizada al bourbon y panceta crocante.'
  },
  {
    id: 102,
    name: 'Hamburguesa Real',
    category: 'A la Parrilla',
    price: 11.50,
    stock: 60,
    sales: 840,
    badgeLevel: 'Nivel: Esencial Smash',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada Maillard, queso americano fundido, pepinillos agridulces y aderezo imperial.'
  },
  {
    id: 103,
    name: 'Hamburguesa Royal Crispy',
    category: 'Pollo Crispy',
    price: 12.99,
    stock: 35,
    sales: 520,
    badgeLevel: 'Nivel: Especialista Crispy',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada en buttermilk 24h y 11 especias secretas, doble rebozado extra crocante, ensalada coleslaw fresca con manzana.'
  },
  {
    id: 104,
    name: 'HamburguesaDouble Whopper',
    category: 'Gigantes XXL',
    price: 15.50,
    stock: 28,
    sales: 900,
    badgeLevel: 'Nivel: Master Chef XXL',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
    description: 'Doble medallón gigante a la parrilla de carbón vivo, lechuga romana, tomate maduro, aros de cebolla morada y salsa tártara.'
  }
];

// Consumers data according to consumption tiers
const INITIAL_CONSUMERS = [
  {
    id: 'C-101',
    name: 'Pablo Valdivia M.',
    email: 'pablo@nextcollege.edu',
    avatar: '👨‍🍳',
    tier: 'VIP Platinum',
    tierColor: '#f59e0b',
    ordersCount: 28,
    burgersConsumed: 54,
    totalSpent: 742.50,
    favoriteBurger: 'Rey de las hamburguesas a la parrilla',
    lastActive: 'Hace 15 min',
    status: 'Frecuente Activo'
  },
  {
    id: 'C-102',
    name: 'Mariana Silva Reyes',
    email: 'mariana.silva@techgrill.com',
    avatar: '👩‍💼',
    tier: 'VIP Platinum',
    tierColor: '#f59e0b',
    ordersCount: 22,
    burgersConsumed: 46,
    totalSpent: 618.00,
    favoriteBurger: 'HamburguesaDouble Whopper',
    lastActive: 'Hoy, 14:20',
    status: 'Frecuente Activo'
  },
  {
    id: 'C-103',
    name: 'Carlos Andrés Mendoza',
    email: 'cmendoza@foodies.pe',
    avatar: '👨‍🎓',
    tier: 'Gold Frecuente',
    tierColor: '#38bdf8',
    ordersCount: 14,
    burgersConsumed: 26,
    totalSpent: 338.40,
    favoriteBurger: 'Hamburguesa Real',
    lastActive: 'Ayer',
    status: 'Frecuente Activo'
  },
  {
    id: 'C-104',
    name: 'Lucía Benavides P.',
    email: 'lucia.b@gastronomia.com',
    avatar: '👩‍🔬',
    tier: 'Gold Frecuente',
    tierColor: '#38bdf8',
    ordersCount: 11,
    burgersConsumed: 19,
    totalSpent: 264.00,
    favoriteBurger: 'Hamburguesa Royal Crispy',
    lastActive: 'Hace 3 días',
    status: 'Frecuente Activo'
  },
  {
    id: 'C-105',
    name: 'Rodrigo Cáceres V.',
    email: 'rodrigo.c@empresa.org',
    avatar: '👨‍💼',
    tier: 'Silver Ocasional',
    tierColor: '#94a3b8',
    ordersCount: 4,
    burgersConsumed: 6,
    totalSpent: 89.50,
    favoriteBurger: 'Rey de las hamburguesas a la parrilla',
    lastActive: 'Hace 1 semana',
    status: 'Ocasional'
  },
  {
    id: 'C-106',
    name: 'Sofía Santillán',
    email: 'sofia.s@startup.io',
    avatar: '👩‍💻',
    tier: 'Silver Ocasional',
    tierColor: '#94a3b8',
    ordersCount: 2,
    burgersConsumed: 3,
    totalSpent: 42.00,
    favoriteBurger: 'Hamburguesa Real',
    lastActive: 'Hace 2 semanas',
    status: 'Nuevo Cliente'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'burgers' | 'consumers' | 'database'
  const [serverHealth, setServerHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [products, setProducts] = useState(FALLBACK_BURGERS);
  const [consumers, setConsumers] = useState(INITIAL_CONSUMERS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [notification, setNotification] = useState('');

  // Filtering states
  const [burgerCategoryFilter, setBurgerCategoryFilter] = useState('Todas');
  const [burgerSearch, setBurgerSearch] = useState('');
  const [consumerTierFilter, setConsumerTierFilter] = useState('Todos');
  const [consumerSearch, setConsumerSearch] = useState('');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'A la Parrilla',
    price: '',
    stock: '',
    image: '',
    description: ''
  });

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Fetch Health status
  const fetchHealth = () => {
    setLoadingHealth(true);
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerHealth(data);
        setLoadingHealth(false);
      })
      .catch(err => {
        console.warn('Backend API not responding, using offline telemetry:', err);
        setServerHealth({
          status: 'healthy-fallback',
          timestamp: new Date().toISOString(),
          uptime: 3600,
          database: {
            mode: 'in-memory',
            connected: false,
            host: '172.18.0.1 (Dokploy bridge)',
            database: 'demo',
            user: 'pablovaldivia'
          }
        });
        setLoadingHealth(false);
      });
  };

  // Fetch Products
  const fetchProducts = () => {
    setLoadingProducts(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          // Merge sales & badgeLevel if missing
          const enriched = data.data.map(item => {
            const match = FALLBACK_BURGERS.find(f => f.id === item.id || f.name.toLowerCase() === item.name.toLowerCase());
            return {
              ...item,
              badgeLevel: item.badgeLevel || match?.badgeLevel || 'Nivel: Master Grill',
              sales: item.sales || match?.sales || Math.floor(Math.random() * 400 + 100)
            };
          });
          setProducts(enriched);
        }
        setLoadingProducts(false);
      })
      .catch(err => {
        console.warn('API error, using cached products:', err);
        setProducts(FALLBACK_BURGERS);
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    fetchHealth();
    fetchProducts();
  }, []);

  // Stock Adjustment
  const handleUpdateStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
    showNotify(`Inventario actualizado para el producto #${id}`);
  };

  // Add new burger
  const handleCreateBurger = async (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) {
      alert('Por favor completa el nombre y el precio');
      return;
    }

    try {
      const payload = {
        name: newBurger.name,
        category: newBurger.category,
        price: parseFloat(newBurger.price),
        stock: parseInt(newBurger.stock, 10) || 50,
        image: newBurger.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
        description: newBurger.description || 'Hamburguesa gourmet de autor preparada a la parrilla.'
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotify('✅ ¡Hamburguesa creada y registrada en el sistema!');
        setIsAddModalOpen(false);
        setNewBurger({ name: '', category: 'A la Parrilla', price: '', stock: '', image: '', description: '' });
        fetchProducts();
      }
    } catch {
      // Local fallback
      const localItem = {
        id: Date.now(),
        name: newBurger.name,
        category: newBurger.category,
        price: parseFloat(newBurger.price),
        stock: parseInt(newBurger.stock, 10) || 50,
        sales: 0,
        badgeLevel: 'Nivel: Nueva Creación',
        image: newBurger.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
        description: newBurger.description
      };
      setProducts([localItem, ...products]);
      setIsAddModalOpen(false);
      showNotify('✅ Hamburguesa guardada localmente');
    }
  };

  // Reset Demo
  const handleResetData = async () => {
    if (!confirm('¿Deseas restablecer los datos del catálogo y métricas demo?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      showNotify('🔄 Base de datos restablecida con datos demo de NextCollege');
      fetchProducts();
      fetchHealth();
    } catch {
      setProducts(FALLBACK_BURGERS);
      showNotify('🔄 Catálogo restablecido');
    }
  };

  // Filtered lists
  const filteredBurgers = products.filter(b => {
    const matchCat = burgerCategoryFilter === 'Todas' || b.category === burgerCategoryFilter;
    const matchText = b.name.toLowerCase().includes(burgerSearch.toLowerCase());
    return matchCat && matchText;
  });

  const filteredConsumers = consumers.filter(c => {
    const matchTier = consumerTierFilter === 'Todos' || c.tier.includes(consumerTierFilter);
    const matchText = c.name.toLowerCase().includes(consumerSearch.toLowerCase()) || 
                        c.email.toLowerCase().includes(consumerSearch.toLowerCase());
    return matchTier && matchText;
  });

  // Calculate Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalCatalogValue = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.price || 0)), 0);
  const totalBurgersConsumed = consumers.reduce((acc, c) => acc + c.burgersConsumed, 0);
  const totalRevenue = consumers.reduce((acc, c) => acc + c.totalSpent, 0);
  const averageTicket = totalRevenue / consumers.reduce((acc, c) => acc + c.ordersCount, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid #38bdf8',
          color: '#f8fafc',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '0.88rem',
          fontWeight: '700',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)'
        }}>
          {notification}
        </div>
      )}

      {/* Top Header */}
      <header style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '1.6rem',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            padding: '4px 8px',
            borderRadius: '10px'
          }}>
            ⚙️
          </span>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'white', lineHeight: '1.2' }}>
              NextCollege <span style={{ color: '#f59e0b' }}>Rapid</span> Admin
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
              Panel de Control & Business Intelligence de Hamburguesas
            </div>
          </div>
        </div>

        {/* Database Quick Health Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#131b2e',
            border: '1px solid #1e293b',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: serverHealth?.database?.connected ? '#10b981' : '#f59e0b',
              boxShadow: serverHealth?.database?.connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
            }} />
            <span style={{ color: '#cbd5e1', fontWeight: '600' }}>
              DB: <strong style={{ color: serverHealth?.database?.connected ? '#10b981' : '#f59e0b' }}>
                {serverHealth?.database?.mode === 'mysql' ? 'MySQL 3306' : 'In-Memory'}
              </strong>
            </span>
          </div>

          <a
            href="/"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#38bdf8',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}
          >
            🌐 E-commerce
          </a>

          <a
            href="/app"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}
          >
            📱 PWA Móvil
          </a>
        </div>
      </header>

      {/* Sub-nav Navigation Tabs */}
      <nav style={{
        background: '#090d16',
        borderBottom: '1px solid #1e293b',
        padding: '0 24px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto'
      }}>
        {[
          { key: 'overview', label: '📊 Visor General', count: null },
          { key: 'burgers', label: '🍔 Hamburguesas Disponibles', count: products.length },
          { key: 'consumers', label: '👥 Consumidores por Consumo', count: consumers.length },
          { key: 'database', label: '🗄️ Estado de Base de Datos', count: serverHealth?.database?.mode || 'OK' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #38bdf8' : '3px solid transparent',
              color: activeTab === tab.key ? 'white' : '#94a3b8',
              padding: '12px 14px',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab.key ? '800' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{
                background: '#1e293b',
                color: '#38bdf8',
                fontSize: '0.7rem',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: '800'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '24px', maxWidth: '1300px', width: '100%', margin: '0 auto' }} className="fade-in">
        
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & GENERAL METRICS                             */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* Top KPIs Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Consumidores Activos</span>
                  <span style={{ fontSize: '1.4rem' }}>👥</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginTop: '6px' }}>
                  1,842
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>
                  ↑ +18.4% vs mes anterior
                </div>
              </div>

              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Consumo Total Facturado</span>
                  <span style={{ fontSize: '1.4rem' }}>💰</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#38bdf8', marginTop: '6px' }}>
                  ${totalRevenue.toFixed(2)} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>USD</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>
                  ↑ Ticket promedio: ${averageTicket.toFixed(2)} USD
                </div>
              </div>

              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Hamburguesas Servidas</span>
                  <span style={{ fontSize: '1.4rem' }}>🍔</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#f59e0b', marginTop: '6px' }}>
                  {totalBurgersConsumed + 2800} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>unid.</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '4px', fontWeight: '700' }}>
                  Top: Rey de las hamburguesas a la parrilla
                </div>
              </div>

              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Estado de la DB</span>
                  <span style={{ fontSize: '1.4rem' }}>🗄️</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: serverHealth?.database?.connected ? '#10b981' : '#f59e0b', marginTop: '8px' }}>
                  {serverHealth?.database?.mode === 'mysql' ? '🐬 MySQL Activo' : '⚡ In-Memory Resiliente'}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                  Host: {serverHealth?.database?.host || 'Auto'}
                </div>
              </div>

            </div>

            {/* Consumer Segmentation & Database Status Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              
              {/* Segmentation by Consumption */}
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                    Segmentación de Consumidores por Volumen
                  </h3>
                  <button onClick={() => setActiveTab('consumers')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                    Ver tabla &rarr;
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: '800' }}>👑 VIP Platinum (&gt; 8 pedidos/mes)</span>
                      <span style={{ color: 'white', fontWeight: '700' }}>320 clientes (48% facturación)</span>
                    </div>
                    <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '48%', height: '100%', background: '#f59e0b' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: '800' }}>⭐ Gold Frecuente (3 a 7 pedidos/mes)</span>
                      <span style={{ color: 'white', fontWeight: '700' }}>740 clientes (36% facturación)</span>
                    </div>
                    <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '36%', height: '100%', background: '#38bdf8' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '800' }}>🍔 Silver Ocasional (1 a 2 pedidos/mes)</span>
                      <span style={{ color: 'white', fontWeight: '700' }}>782 clientes (16% facturación)</span>
                    </div>
                    <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '16%', height: '100%', background: '#94a3b8' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', background: '#0b0f19', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>LTV Promedio Cliente VIP:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b' }}>$680.25 USD</span>
                </div>
              </div>

              {/* 4 Flagship Burgers Quick Stock Monitor */}
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                    Stock de las 4 Hamburguesas Maestras
                  </h3>
                  <button onClick={() => setActiveTab('burgers')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                    Gestionar &rarr;
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {products.slice(0, 4).map(b => (
                    <div
                      key={b.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '10px 14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={b.image} alt={b.name} style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ color: 'white', fontWeight: '800', fontSize: '0.85rem' }}>{b.name}</div>
                          <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: '700' }}>${b.price.toFixed(2)} USD</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: b.stock > 30 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: b.stock > 30 ? '#10b981' : '#ef4444'
                        }}>
                          {b.stock} en stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: BURGERS CATALOG MANAGEMENT                             */}
        {/* ============================================================== */}
        {activeTab === 'burgers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>
                  🍔 Catálogo de Hamburguesas Disponibles
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Gestión en tiempo real de productos, stock, precios y niveles gastronómicos.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleResetData}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reset Demo
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>+</span> Nueva Hamburguesa
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div style={{
              background: '#131b2e',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {['Todas', 'A la Parrilla', 'Pollo Crispy', 'Gigantes XXL'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setBurgerCategoryFilter(cat)}
                    style={{
                      background: burgerCategoryFilter === cat ? '#2563eb' : '#0b0f19',
                      border: `1px solid ${burgerCategoryFilter === cat ? '#38bdf8' : '#1e293b'}`,
                      color: burgerCategoryFilter === cat ? 'white' : '#94a3b8',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={burgerSearch}
                onChange={(e) => setBurgerSearch(e.target.value)}
                placeholder="🔍 Filtrar hamburguesa..."
                style={{
                  background: '#0b0f19',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: 'white',
                  fontSize: '0.82rem',
                  outline: 'none',
                  minWidth: '220px'
                }}
              />
            </div>

            {/* Burgers Table */}
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '14px 18px' }}>Hamburguesa</th>
                      <th style={{ padding: '14px 18px' }}>Categoría & Nivel</th>
                      <th style={{ padding: '14px 18px' }}>Precio</th>
                      <th style={{ padding: '14px 18px' }}>Stock</th>
                      <th style={{ padding: '14px 18px' }}>Consumo / Ventas</th>
                      <th style={{ padding: '14px 18px' }}>Estado</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ajustar Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBurgers.map((b, idx) => (
                      <tr
                        key={b.id}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? '#131b2e' : '#111827',
                          transition: 'background 0.2s'
                        }}
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={b.image} alt={b.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ color: 'white', fontWeight: '800', fontSize: '0.92rem' }}>
                                {b.name}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
                                ID: #{b.id} &bull; {b.description?.slice(0, 45)}...
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ color: '#cbd5e1', fontWeight: '700' }}>{b.category}</div>
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '700' }}>
                            {b.badgeLevel || 'Nivel: Gourmet'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', color: '#38bdf8', fontWeight: '900', fontSize: '1rem' }}>
                          ${b.price.toFixed(2)} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>USD</span>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: '900',
                            color: b.stock > 30 ? '#10b981' : '#ef4444'
                          }}>
                            {b.stock} unidades
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', color: 'white', fontWeight: '700' }}>
                          {b.sales || 320} pedidos
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            background: b.stock > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: b.stock > 10 ? '#10b981' : '#ef4444'
                          }}>
                            {b.stock > 10 ? 'DISPONIBLE' : 'BAJO STOCK'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => handleUpdateStock(b.id, -5)}
                              style={{ background: '#1e293b', border: '1px solid #334155', color: '#ef4444', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: '900' }}
                              title="Restar 5 de stock"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleUpdateStock(b.id, 10)}
                              style={{ background: '#2563eb', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: '900' }}
                              title="Agregar 10 de stock"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CONSUMERS METRICS ACCORDING TO CONSUMPTION             */}
        {/* ============================================================== */}
        {activeTab === 'consumers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>
                  👥 Métricas de Consumidores por Nivel de Consumo
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Segmentación de clientes según frecuencia de compra, gasto total y hamburguesa predilecta.
                </p>
              </div>

              {/* Tier Filters */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Todos', 'Platinum', 'Gold', 'Silver'].map(t => (
                  <button
                    key={t}
                    onClick={() => setConsumerTierFilter(t)}
                    style={{
                      background: consumerTierFilter === t ? '#2563eb' : '#131b2e',
                      border: `1px solid ${consumerTierFilter === t ? '#38bdf8' : '#1e293b'}`,
                      color: consumerTierFilter === t ? 'white' : '#94a3b8',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Consumers Table */}
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '14px 18px' }}>Consumidor / Cliente</th>
                      <th style={{ padding: '14px 18px' }}>Nivel de Consumo (Tier)</th>
                      <th style={{ padding: '14px 18px' }}>Órdenes Totales</th>
                      <th style={{ padding: '14px 18px' }}>Hamburguesas Consumidas</th>
                      <th style={{ padding: '14px 18px' }}>Gasto Acumulado</th>
                      <th style={{ padding: '14px 18px' }}>Hamburguesa Favorita</th>
                      <th style={{ padding: '14px 18px' }}>Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsumers.map((c, idx) => (
                      <tr
                        key={c.id}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: idx % 2 === 0 ? '#131b2e' : '#111827'
                        }}
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem', background: '#1e293b', padding: '6px', borderRadius: '50%' }}>
                              {c.avatar}
                            </span>
                            <div>
                              <div style={{ color: 'white', fontWeight: '800' }}>{c.name}</div>
                              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{c.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            background: c.tierColor + '20',
                            color: c.tierColor,
                            border: `1px solid ${c.tierColor}40`
                          }}>
                            {c.tier}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', color: 'white', fontWeight: '700' }}>
                          {c.ordersCount} pedidos
                        </td>

                        <td style={{ padding: '14px 18px', color: '#38bdf8', fontWeight: '800' }}>
                          {c.burgersConsumed} unid.
                        </td>

                        <td style={{ padding: '14px 18px', color: '#10b981', fontWeight: '900', fontSize: '1rem' }}>
                          ${c.totalSpent.toFixed(2)} USD
                        </td>

                        <td style={{ padding: '14px 18px', color: '#e2e8f0', fontWeight: '600' }}>
                          🍔 {c.favoriteBurger}
                        </td>

                        <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.78rem' }}>
                          {c.lastActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DATABASE & INFRASTRUCTURE STATUS                       */}
        {/* ============================================================== */}
        {activeTab === 'database' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white' }}>
                  🗄️ Estado de la Base de Datos & Servidor
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Telemetría del pool de conexiones MySQL y fallback resiliente en memoria.
                </p>
              </div>

              <button
                onClick={fetchHealth}
                disabled={loadingHealth}
                style={{
                  background: '#2563eb',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {loadingHealth ? 'Comprobando...' : '🔄 Probar Conexión'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Database Status Card */}
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px' }}>
                  Modo de Operación
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: serverHealth?.database?.connected ? '#10b981' : '#f59e0b', marginBottom: '16px' }}>
                  {serverHealth?.database?.mode === 'mysql' ? '🐬 Conectado a MySQL Dokploy' : '⚡ Operando en Modo In-Memory Fallback'}
                </div>

                <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Host DB:</span>
                    <strong style={{ color: 'white' }}>{serverHealth?.database?.host || '172.18.0.1 (Dokploy)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Puerto:</span>
                    <strong style={{ color: 'white' }}>3306</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Base de Datos:</span>
                    <strong style={{ color: 'white' }}>{serverHealth?.database?.database || 'demo'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Usuario:</span>
                    <strong style={{ color: 'white' }}>{serverHealth?.database?.user || 'pablovaldivia'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Último Error:</span>
                    <span style={{ color: serverHealth?.database?.error ? '#ef4444' : '#10b981' }}>
                      {serverHealth?.database?.error || 'Ninguno (Todo OK)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Server Runtime Info */}
              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px' }}>
                  Telemetría del Servidor Node.js
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white', marginBottom: '16px' }}>
                  Node.js v20+ & Express
                </div>

                <div style={{ display: 'grid', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Health Endpoint:</span>
                    <strong style={{ color: '#38bdf8' }}>/api/health (200 OK)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Uptime del Proceso:</span>
                    <strong style={{ color: 'white' }}>{Math.floor(serverHealth?.uptime || 0)} seg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Plataforma:</span>
                    <strong style={{ color: 'white' }}>Dokploy CI/CD Live</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Timestamp Telemetría:</span>
                    <strong style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{serverHealth?.timestamp || new Date().toISOString()}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleResetData}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#ef4444',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Truncar y Resetear Tablas
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: AGREGAR NUEVA HAMBURGUESA                               */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '800' }}>
                🍔 Registrar Nueva Hamburguesa
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: '#1f2937', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBurger} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nombre de la Hamburguesa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hamburguesa Monster Trufada"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Categoría</label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                  >
                    <option value="A la Parrilla">A la Parrilla</option>
                    <option value="Pollo Crispy">Pollo Crispy</option>
                    <option value="Gigantes XXL">Gigantes XXL</option>
                    <option value="Smash Burger">Smash Burger</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Precio ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Stock Inicial</label>
                <input
                  type="number"
                  placeholder="50"
                  value={newBurger.stock}
                  onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                  style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>URL de Imagen</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newBurger.image}
                  onChange={(e) => setNewBurger({ ...newBurger, image: e.target.value })}
                  style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Descripción de Ingredientes</label>
                <textarea
                  rows="2"
                  placeholder="Doble medallón, queso fundido, salsa secreta..."
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Guardar Hamburguesa en Base de Datos
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
