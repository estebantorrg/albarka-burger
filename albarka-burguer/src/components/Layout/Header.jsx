import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Header.css'

const routeNames = {
  '/':             'Dashboard',
  '/facturacion':  'Facturación',
  '/anulacion':    'Anulación de Facturas',
}

export default function Header({ onToggleSidebar }) {
  const location = useLocation()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const currentRoute = routeNames[location.pathname] || 'Albarka Burger'

  const dateStr = now.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const timeStr = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-toggle"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <div>
          <div className="header-title">{currentRoute}</div>
          <div className="header-breadcrumb">
            <span>Albarka Burger</span>
            <span className="header-breadcrumb-sep">/</span>
            <span>{currentRoute}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-datetime">
          <span className="header-date">{dateStr}</span>
          <span className="header-time">{timeStr}</span>
        </div>
        <button className="header-notification" aria-label="Notificaciones">
          🔔
          <span className="header-notification-badge">3</span>
        </button>
      </div>
    </header>
  )
}
