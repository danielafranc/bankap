import { useMemo } from 'react'
import { PROVIDER, SV, hm, longDate, money, shortDate, waLink, type Booking } from '@bankap/core'
import type { Say } from '../App.tsx'
import { downloadIcs } from '../ics.ts'
import { Check, Chevron } from '../icons.tsx'

interface Props { booking: Booking; say: Say; restart: () => void }

export default function Listo({ booking: b, say, restart }: Props) {
  const sv = SV[b.serviceId]
  // El token real lo genera el backend (RNF-04); acá solo armamos la forma del link.
  const manageUrl = useMemo(() => `${location.origin}/turnos/${PROVIDER.slug}/gestion/${crypto.randomUUID()}`, [])
  const wa = waLink(PROVIDER.phone, `¡Hola ${PROVIDER.first}! Reservé ${sv.name.toLowerCase()} el ${shortDate(b.date)} a las ${hm(b.start)}.`)

  return (
    <>
      <main className="page">
        <div className="done-head">
          <div className="done-badge"><Check size={34} w={2.2} /></div>
          <h1>¡Listo, {b.client.split(' ')[0]}!<br />Tu turno está confirmado</h1>
          <p>Te enviamos un email a <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{b.email}</span> con el link para cancelar o reprogramar.</p>
        </div>
        <div className="summary tight">
          <div className="row">
            <div className="stack"><div className="t15">{sv.name}</div><div className="sub13">con {PROVIDER.name}</div></div>
            <div className="price">{money(sv.price)}</div>
          </div>
          <div className="hr" />
          <div className="cols2">
            <div className="stack"><div className="lbl">Fecha</div><div className="t14">{longDate(b.date)}</div></div>
            <div className="stack"><div className="lbl">Hora</div><div className="t14">{hm(b.start)} – {hm(b.start + b.dur)}</div></div>
          </div>
          <div className="stack"><div className="lbl">Dirección</div><div className="t14">{PROVIDER.address}</div></div>
        </div>
        <div className="actions">
          <button className="action" onClick={() => { downloadIcs(b, manageUrl); say('Se descargó el evento con el link para gestionar tu turno.') }}>
            <i style={{ width: 20, height: 20, borderRadius: 5, border: '1.8px solid var(--ink)', borderTopWidth: 4 }} />
            <span>Agregar a mi calendario</span><Chevron />
          </button>
          <a className="action" href={wa} target="_blank" rel="noopener noreferrer">
            <i style={{ width: 20, height: 20, borderRadius: '50%', border: '1.8px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i style={{ width: 6, height: 6, borderRadius: '50%', background: '#3aa86b' }} />
            </i>
            <span>Avisale por WhatsApp</span><Chevron />
          </a>
        </div>
      </main>
      <div className="cta-bar">
        <button className="btn-primary" onClick={restart}>Volver al inicio</button>
      </div>
    </>
  )
}
