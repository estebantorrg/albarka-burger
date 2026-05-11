import { NavLink, useLocation } from 'react-router-dom'
import './Sidebar.css'

/* ── SVG icon helper ── */
const Icon = ({ d, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sidebar-link-icon"
    {...props}
  >
    <path d={d} />
  </svg>
)

/* ── Icons ── */
const icons = {
  dashboard:
    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10',
  facturacion:
    'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  anulacion:
    'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const navItems = [
    { to: '/',           icon: 'dashboard',   label: 'Dashboard' },
    { to: '/facturacion', icon: 'facturacion', label: 'Facturación' },
    { to: '/anulacion',   icon: 'anulacion',   label: 'Anulación Facturas' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">🍔</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">Albarka Burger</span>
            <span className="sidebar-brand-sub">Sistema POS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Menú Principal</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <Icon d={icons[item.icon]} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">ET</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Esteban Torres</span>
              <span className="sidebar-user-role">Administrador</span>
            </div>
          </div>
          <div className="sidebar-status">
            <span className="sidebar-status-dot" />
            Sesión activa
          </div>
        </div>
      </aside>
    </>
  )
}
