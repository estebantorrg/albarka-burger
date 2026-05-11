import { useState, useEffect } from 'react'
import './Anulacion.css'

/* ── Datos de ejemplo de facturas ── */
const INITIAL_INVOICES = [
  { id: 'FAC-001', date: '2026-05-11', customer: 'Mesa 4',  products: 'Combo Albarka x2',      total: 76000,  method: 'Efectivo',  status: 'Pagado'  },
  { id: 'FAC-002', date: '2026-05-11', customer: 'Mesa 2',  products: 'Hamburguesa Doble',      total: 28000,  method: 'Datáfono',  status: 'Pagado'  },
  { id: 'FAC-003', date: '2026-05-11', customer: 'Domicilio',products: 'Combo Familiar',         total: 89000,  method: 'Nequi',     status: 'Pendiente' },
  { id: 'FAC-004', date: '2026-05-10', customer: 'Mesa 1',  products: 'Papas + Malteada',       total: 22000,  method: 'Efectivo',  status: 'Pagado'  },
  { id: 'FAC-005', date: '2026-05-10', customer: 'Mesa 6',  products: 'Hamburguesa BBQ x3',     total: 96000,  method: 'Datáfono',  status: 'Pagado'  },
  { id: 'FAC-006', date: '2026-05-10', customer: 'Domicilio',products: 'Combo Kids + Gaseosa',   total: 27000,  method: 'Nequi',     status: 'Pendiente' },
  { id: 'FAC-007', date: '2026-05-09', customer: 'Mesa 3',  products: 'Nuggets x6 + Jugo',      total: 22000,  method: 'Efectivo',  status: 'Anulado'  },
]

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

const now = () =>
  new Date().toLocaleString('es-CO', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

export default function Anulacion() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [searchId, setSearchId] = useState('')

  // Anulación modal
  const [anulacionModal, setAnulacionModal] = useState(null)
  const [anulacionReason, setAnulacionReason] = useState('')
  const [anulacionUser, setAnulacionUser] = useState('Esteban Torres')

  // Estado modal
  const [estadoModal, setEstadoModal] = useState(null)
  const [newEstado, setNewEstado] = useState('')

  // Toast
  const [toast, setToast] = useState(null)

  /* Auto-hide toast */
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  /* ── Filtrado ── */
  const filtered = invoices.filter((inv) => {
    const matchStatus = filterStatus === 'Todos' || inv.status === filterStatus
    const matchId = inv.id.toLowerCase().includes(searchId.toLowerCase())
    return matchStatus && matchId
  })

  /* ── Anular factura ── */
  const handleAnulacion = () => {
    if (!anulacionReason.trim()) return
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === anulacionModal.id
          ? {
              ...inv,
              status: 'Anulado',
              anulacionReason,
              anulacionDate: now(),
              anulacionUser,
            }
          : inv
      )
    )
    setAnulacionModal(null)
    setAnulacionReason('')
    setToast({ type: 'danger', message: `Factura ${anulacionModal.id} anulada correctamente.` })
  }

  /* ── Actualizar estado de pedido ── */
  const handleEstadoUpdate = () => {
    if (!newEstado) return
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === estadoModal.id
          ? { ...inv, status: newEstado, lastModified: now(), modifiedBy: 'Esteban Torres' }
          : inv
      )
    )
    setEstadoModal(null)
    setNewEstado('')
    setToast({ type: 'success', message: `Estado de ${estadoModal.id} actualizado a "${newEstado}".` })
  }

  return (
    <div className="anulacion-page">
      {/* Header */}
      <div className="anulacion-header">
        <h1>📋 Gestión de Facturas</h1>
        <span className="badge badge-danger">RF 2.2 — Anulación / Estados</span>
      </div>

      {/* Filtros */}
      <div className="anulacion-filters">
        <div className="form-group">
          <label className="form-label">Buscar Factura</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: FAC-001"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            id="search-invoice"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Filtrar por Estado</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            id="filter-status"
          >
            <option value="Todos">Todos</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>

      {/* Tabla de facturas */}
      <div className="anulacion-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No se encontraron facturas
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id}>
                  <td className="invoice-id-cell">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{inv.customer}</td>
                  <td>{inv.products}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(inv.total)}</td>
                  <td>{inv.method}</td>
                  <td>
                    <span
                      className={`badge ${
                        inv.status === 'Pagado'
                          ? 'badge-success'
                          : inv.status === 'Pendiente'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {inv.status === 'Pagado' && '✓ '}
                      {inv.status === 'Pendiente' && '⏳ '}
                      {inv.status === 'Anulado' && '✕ '}
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      {inv.status !== 'Anulado' && (
                        <>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setAnulacionModal(inv)
                              setAnulacionReason('')
                            }}
                            title="Anular factura"
                          >
                            Anular
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEstadoModal(inv)
                              setNewEstado('')
                            }}
                            title="Cambiar estado"
                          >
                            Estado
                          </button>
                        </>
                      )}
                      {inv.status === 'Anulado' && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {inv.anulacionReason ? `Motivo: ${inv.anulacionReason}` : 'Anulado'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Modal de Anulación ─── */}
      {anulacionModal && (
        <div className="anulacion-modal-overlay" onClick={() => setAnulacionModal(null)}>
          <div className="anulacion-modal" onClick={(e) => e.stopPropagation()}>
            <div className="anulacion-modal-header">
              <h2>⚠️ Anular Factura</h2>
              <button className="anulacion-modal-close" onClick={() => setAnulacionModal(null)}>
                ✕
              </button>
            </div>

            {/* Info de la factura */}
            <div className="anulacion-modal-info">
              <div className="anulacion-modal-info-item">
                <span className="anulacion-modal-info-label">N° Factura</span>
                <span className="anulacion-modal-info-value" style={{ color: 'var(--brand-primary)' }}>
                  {anulacionModal.id}
                </span>
              </div>
              <div className="anulacion-modal-info-item">
                <span className="anulacion-modal-info-label">Total</span>
                <span className="anulacion-modal-info-value">{fmt(anulacionModal.total)}</span>
              </div>
              <div className="anulacion-modal-info-item">
                <span className="anulacion-modal-info-label">Fecha de Modificación</span>
                <span className="anulacion-modal-info-value">{now()}</span>
              </div>
              <div className="anulacion-modal-info-item">
                <span className="anulacion-modal-info-label">Estado Actual</span>
                <span className="anulacion-modal-info-value">{anulacionModal.status}</span>
              </div>
            </div>

            {/* Formulario */}
            <div className="anulacion-modal-form">
              <div className="form-group">
                <label className="form-label" htmlFor="anulacion-reason">Motivo de Anulación *</label>
                <textarea
                  id="anulacion-reason"
                  className="form-textarea"
                  placeholder="Describe el motivo por el cual se anula esta factura…"
                  value={anulacionReason}
                  onChange={(e) => setAnulacionReason(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="anulacion-user">Usuario que Autoriza</label>
                <input
                  id="anulacion-user"
                  className="form-input"
                  type="text"
                  value={anulacionUser}
                  onChange={(e) => setAnulacionUser(e.target.value)}
                />
              </div>

              <div className="anulacion-warning">
                <span className="anulacion-warning-icon">⚠️</span>
                <span>
                  Esta acción es irreversible. La factura <strong>{anulacionModal.id}</strong> quedará
                  registrada como anulada y no podrá ser revertida.
                </span>
              </div>

              <div className="anulacion-modal-actions">
                <button className="btn btn-secondary" onClick={() => setAnulacionModal(null)}>
                  Cancelar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleAnulacion}
                  disabled={!anulacionReason.trim()}
                  style={{
                    opacity: !anulacionReason.trim() ? .5 : 1,
                    cursor: !anulacionReason.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  🗑️ Confirmar Anulación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal de Estado ─── */}
      {estadoModal && (
        <div className="anulacion-modal-overlay" onClick={() => setEstadoModal(null)}>
          <div className="anulacion-modal estado-modal" onClick={(e) => e.stopPropagation()}>
            <div className="anulacion-modal-header">
              <h2>🔄 Actualizar Estado</h2>
              <button className="anulacion-modal-close" onClick={() => setEstadoModal(null)}>
                ✕
              </button>
            </div>

            <p style={{ marginBottom: 4, fontSize: 14 }}>
              Factura: <strong style={{ color: 'var(--brand-primary)' }}>{estadoModal.id}</strong>
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              Estado actual: <strong>{estadoModal.status}</strong>
            </p>

            <div className="estado-options">
              <button
                className={`estado-option ${newEstado === 'Pendiente' ? 'selected' : ''}`}
                onClick={() => setNewEstado('Pendiente')}
              >
                <span className="estado-option-icon">⏳</span>
                Pendiente
              </button>
              <button
                className={`estado-option ${newEstado === 'Pagado' ? 'selected' : ''}`}
                onClick={() => setNewEstado('Pagado')}
              >
                <span className="estado-option-icon">✅</span>
                Pagado
              </button>
            </div>

            <div className="anulacion-modal-actions">
              <button className="btn btn-secondary" onClick={() => setEstadoModal(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleEstadoUpdate}
                disabled={!newEstado}
                style={{
                  opacity: !newEstado ? .5 : 1,
                  cursor: !newEstado ? 'not-allowed' : 'pointer',
                }}
              >
                Guardar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast de notificación ─── */}
      {toast && (
        <div className={`notification-toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '🗑️'}</span>
          {toast.message}
        </div>
      )}
    </div>
  )
}
