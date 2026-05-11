import { Link } from 'react-router-dom'
import './Dashboard.css'

/* ── Datos de ejemplo para las estadísticas ── */
const stats = [
  { id: 1, icon: '💰', label: 'Ventas Hoy',       value: '$1.240.000', change: '+12%', dir: 'up',   color: 'orange' },
  { id: 2, icon: '📄', label: 'Facturas Emitidas', value: '38',         change: '+5',   dir: 'up',   color: 'blue'   },
  { id: 3, icon: '✅', label: 'Pedidos Pagados',   value: '35',         change: '92%',  dir: 'up',   color: 'green'  },
  { id: 4, icon: '⏳', label: 'Pedidos Pendientes', value: '3',          change: '-2',   dir: 'down', color: 'red'    },
]

const recentSales = [
  { id: 'FAC-001', products: 'Combo Albarka x2', total: '$56.000',  method: 'Efectivo',  status: 'Pagado'    },
  { id: 'FAC-002', products: 'Hamburguesa Doble',total: '$28.000',  method: 'Datáfono',  status: 'Pagado'    },
  { id: 'FAC-003', products: 'Combo Familiar',   total: '$89.000',  method: 'Nequi',     status: 'Pendiente' },
  { id: 'FAC-004', products: 'Papas + Malteada', total: '$22.000',  method: 'Efectivo',  status: 'Pagado'    },
  { id: 'FAC-005', products: 'Hamburguesa BBQ',  total: '$32.000',  method: 'Datáfono',  status: 'Pagado'    },
]

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Bienvenida */}
      <div className="dashboard-welcome">
        <h1>
          <span className="gradient-text">¡Bienvenido de vuelta!</span>{' '}
          <span className="emoji-inline">👋</span>
        </h1>
        <p>Aquí tienes un resumen de la actividad de hoy en Albarka Burger.</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.id} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
              <span className={`stat-change ${s.dir}`}>
                {s.dir === 'up' ? '↑' : '↓'} {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección inferior: tabla + acciones rápidas */}
      <div className="dashboard-grid">
        {/* Últimas ventas */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Últimas Ventas</h2>
            <Link to="/facturacion" className="btn btn-secondary btn-sm">
              Ver todas →
            </Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td style={{ color: 'var(--neon)', fontWeight: 700 }}>
                      {sale.id}
                    </td>
                    <td style={{ color: 'var(--text-0)' }}>{sale.products}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-0)' }}>
                      {sale.total}
                    </td>
                    <td>{sale.method}</td>
                    <td>
                      <span
                        className={`badge ${
                          sale.status === 'Pagado' ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            Mostrando {recentSales.length} de 38 facturas
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Acciones Rápidas</h2>
          </div>
          <div className="quick-actions">
            <Link to="/facturacion" className="quick-action-btn">
              <div className="quick-action-icon orange">🧾</div>
              <div className="quick-action-text">
                <span className="quick-action-title">Nueva Factura</span>
                <span className="quick-action-desc">Registrar una nueva venta</span>
              </div>
            </Link>
            <Link to="/anulacion" className="quick-action-btn">
              <div className="quick-action-icon red">❌</div>
              <div className="quick-action-text">
                <span className="quick-action-title">Anular Factura</span>
                <span className="quick-action-desc">Gestionar estados de pedidos</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
