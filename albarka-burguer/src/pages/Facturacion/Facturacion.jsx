import { useState, useMemo } from 'react'
import './Facturacion.css'

/* ── Catálogo de productos de ejemplo ── */
const PRODUCTS = [
  { id: 1,  name: 'Hamburguesa Clásica',   price: 18000, emoji: '🍔', category: 'Hamburguesas' },
  { id: 2,  name: 'Hamburguesa Doble',      price: 28000, emoji: '🍔', category: 'Hamburguesas' },
  { id: 3,  name: 'Hamburguesa BBQ',        price: 32000, emoji: '🍔', category: 'Hamburguesas' },
  { id: 4,  name: 'Hamburguesa Pollo',      price: 24000, emoji: '🍗', category: 'Hamburguesas' },
  { id: 5,  name: 'Combo Albarka',          price: 38000, emoji: '🎉', category: 'Combos' },
  { id: 6,  name: 'Combo Familiar',         price: 89000, emoji: '👨‍👩‍👧‍👦', category: 'Combos' },
  { id: 7,  name: 'Combo Kids',             price: 22000, emoji: '🧒', category: 'Combos' },
  { id: 8,  name: 'Papas Francesas',        price: 10000, emoji: '🍟', category: 'Acompañamientos' },
  { id: 9,  name: 'Aros de Cebolla',        price: 12000, emoji: '🧅', category: 'Acompañamientos' },
  { id: 10, name: 'Nuggets x6',             price: 14000, emoji: '🍗', category: 'Acompañamientos' },
  { id: 11, name: 'Gaseosa 400ml',          price: 5000,  emoji: '🥤', category: 'Bebidas' },
  { id: 12, name: 'Malteada',               price: 12000, emoji: '🥛', category: 'Bebidas' },
  { id: 13, name: 'Jugo Natural',           price: 8000,  emoji: '🧃', category: 'Bebidas' },
  { id: 14, name: 'Agua Botella',           price: 3000,  emoji: '💧', category: 'Bebidas' },
]

const CATEGORIES = ['Todos', 'Hamburguesas', 'Combos', 'Acompañamientos', 'Bebidas']

const PAYMENT_METHODS = [
  { id: 'efectivo',  label: 'Efectivo',  icon: '💵' },
  { id: 'datafono',  label: 'Datáfono',  icon: '💳' },
  { id: 'nequi',     label: 'Nequi',     icon: '📱' },
]

const IVA_RATE = 0.08 // 8% IVA

/* ── Formateador de moneda COP ── */
const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

/* ── Generador de número de factura ── */
let invoiceSeq = 6
const nextInvoiceNumber = () => `FAC-${String(++invoiceSeq).padStart(3, '0')}`

export default function Facturacion() {
  // Catálogo
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  // Carrito
  const [cart, setCart] = useState([])

  // Pago
  const [paymentMethod, setPaymentMethod] = useState('')
  const [shippingCost, setShippingCost] = useState(0)

  // Modal
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastInvoice, setLastInvoice] = useState('')

  /* ── Filtrado de productos ── */
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  /* ── Acciones del carrito ── */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setPaymentMethod('')
    setShippingCost(0)
  }

  /* ── Totales ── */
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const iva = Math.round(subtotal * IVA_RATE)
  const total = subtotal + iva + Number(shippingCost || 0)

  /* ── Registrar venta ── */
  const handleSubmit = () => {
    if (cart.length === 0 || !paymentMethod) return
    const invoiceNum = nextInvoiceNumber()
    setLastInvoice(invoiceNum)
    setShowSuccess(true)
    clearCart()
  }

  return (
    <div className="facturacion-page">
      {/* Header */}
      <div className="facturacion-header">
        <h1>
          <span className="emoji-inline">🧾</span>{' '}
          <span className="gradient-text">Registro de Ventas</span>
        </h1>
        <span className="badge badge-info">RF 2.1 — Facturación</span>
      </div>

      <div className="facturacion-grid">
        {/* ─── CATÁLOGO ─── */}
        <div className="product-catalog">
          <div className="catalog-header">
            <h2>Productos</h2>
            <div className="catalog-search">
              <span className="catalog-search-icon">🔍</span>
              <input
                className="form-input"
                type="text"
                placeholder="Buscar producto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="product-search"
              />
            </div>
          </div>

          {/* Categorías */}
          <div className="catalog-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          <div className="product-grid">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => addToCart(product)}
                title={`Añadir ${product.name}`}
              >
                <span className="product-card-emoji">{product.emoji}</span>
                <span className="product-card-name">{product.name}</span>
                <span className="product-card-price">{fmt(product.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PANEL DE FACTURA ─── */}
        <div className="invoice-panel">
          <div className="invoice-panel-header">
            <h2>
              📋 Factura
              <span className="invoice-number">#{String(invoiceSeq + 1).padStart(3, '0')}</span>
            </h2>
            {cart.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                Limpiar
              </button>
            )}
          </div>

          {/* Items del carrito */}
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                Selecciona productos del catálogo
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span className="cart-item-emoji">{item.emoji}</span>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{fmt(item.price)} c/u</div>
                  </div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <span className="cart-item-total">{fmt(item.price * item.qty)}</span>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)} title="Eliminar">
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Show the rest only if cart has items */}
          {cart.length > 0 && (
            <>
              {/* Totales */}
              <div className="invoice-totals">
                <div className="invoice-row">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="invoice-row">
                  <span>IVA (8%)</span>
                  <span>{fmt(iva)}</span>
                </div>
                <div className="invoice-row">
                  <span>Costo de envío</span>
                  <span>{shippingCost > 0 ? fmt(shippingCost) : '—'}</span>
                </div>
                <div className="invoice-row total">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              {/* Método de pago */}
              <div className="payment-section">
                <h3>Método de Pago</h3>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(pm.id)}
                    >
                      <span className="payment-option-icon">{pm.icon}</span>
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Costo de envío */}
              <div className="shipping-section">
                <label htmlFor="shipping-cost">Costo de Envío (opcional)</label>
                <input
                  id="shipping-cost"
                  className="form-input"
                  type="number"
                  min="0"
                  step="500"
                  placeholder="$0"
                  value={shippingCost || ''}
                  onChange={(e) => setShippingCost(Number(e.target.value) || 0)}
                />
              </div>

              {/* Acciones */}
              <div className="invoice-actions">
                <button className="btn btn-secondary" onClick={clearCart}>
                  Cancelar
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  disabled={!paymentMethod}
                  style={{
                    opacity: !paymentMethod ? .5 : 1,
                    cursor: !paymentMethod ? 'not-allowed' : 'pointer',
                  }}
                >
                  💰 Registrar Venta
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Modal de éxito ─── */}
      {showSuccess && (
        <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">✅</span>
            <h2>¡Venta Registrada!</h2>
            <p>
              La factura <strong style={{ color: 'var(--neon)' }}>{lastInvoice}</strong> ha
              sido generada exitosamente.
            </p>
            <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
