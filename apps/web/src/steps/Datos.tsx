import { useState } from 'react'
import { PROVIDER, SV, durL, hm, longDate, money, type Booking } from '@bankap/core'
import type { Flow } from '../App.tsx'
import { store } from '../data.ts'
import { Back } from '../icons.tsx'

export interface FormState { name: string; phone: string; email: string }
type Errors = Partial<Record<keyof FormState, string>>

interface Props { flow: Flow; patch: (p: Partial<Flow>) => void; back: () => void; done: (b: Booking) => void; retry: () => void }

function validate(f: FormState): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 3) e.name = 'Escribí tu nombre y apellido.'
  if (f.phone.replace(/\D/g, '').length < 8) e.phone = 'Revisá el número: necesitamos al menos 8 dígitos.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Ese email no parece válido.'
  return e
}

export default function Datos({ flow, patch, back, done, retry }: Props) {
  const sv = SV[flow.serviceId!]
  const start = flow.start!
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [conflict, setConflict] = useState(false)

  const set = (f: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    patch({ form: { ...flow.form, [f]: ev.target.value } })
    setErrors(e => ({ ...e, [f]: undefined }))
  }

  const confirm = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (submitting) return
    const e = validate(flow.form)
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    const f = flow.form
    const res = await store.create({ date: flow.date, start, serviceId: sv.id, client: f.name.trim(), phone: f.phone.trim(), email: f.email.trim() })
    setSubmitting(false)
    if (res.ok) done(res.booking)
    else setConflict(true)
  }

  const field = (f: keyof FormState, label: string, placeholder: string, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="field">
      <span>{label}</span>
      <input value={flow.form[f]} onChange={set(f)} placeholder={placeholder} aria-invalid={!!errors[f]} {...extra} />
      {errors[f] && <span className="err">{errors[f]}</span>}
    </label>
  )

  return (
    <form onSubmit={confirm} noValidate>
      <main className="page">
        <div className="topbar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Volver"><Back /></button>
          <h1>Revisá y confirmá</h1>
          <div />
        </div>
        <div className="summary">
          <div className="pro">
            <div className="avatar" />
            <div className="stack g2"><div className="t15">{PROVIDER.name}</div><div className="sub13">{PROVIDER.tagline}</div></div>
          </div>
          <div className="hr" />
          <div className="row">
            <div className="stack"><div className="t15">{sv.name}</div><div className="sub13">{durL(sv.dur)}</div></div>
            <div className="price">{money(sv.price)}</div>
          </div>
          <div className="cols2">
            <div className="stack"><div className="lbl">Fecha</div><div className="t14">{longDate(flow.date)}</div></div>
            <div className="stack"><div className="lbl">Hora</div><div className="t14">{hm(start)} – {hm(start + sv.dur)}</div></div>
          </div>
          <div className="stack"><div className="lbl">Dirección</div><div className="t14">{PROVIDER.address}</div></div>
        </div>

        <h2 className="section-title" style={{ marginTop: 22 }}>Tus datos</h2>
        <div style={{ marginTop: 4, fontSize: 13, color: 'var(--muted)', textWrap: 'pretty' }}>No necesitás cuenta. Te mandamos la confirmación por email.</div>
        <div className="form">
          {field('name', 'Nombre y apellido', 'Sofía Martínez', { autoComplete: 'name' })}
          {field('phone', 'Celular', '11 2345 6789', { inputMode: 'tel', type: 'tel', autoComplete: 'tel-national' })}
          {field('email', 'Email', 'sofia@gmail.com', { type: 'email', autoComplete: 'email' })}
        </div>
        <div className="note">
          <span style={{ color: 'var(--body)' }}>Pagás en el local</span><span style={{ fontWeight: 600 }}>{money(sv.price)}</span>
          <span style={{ color: 'var(--muted)', gridColumn: '1 / -1' }}>Podés cancelar o reprogramar hasta 24 h antes.</span>
        </div>
      </main>
      <div className="cta-bar">
        <button type="submit" className="btn-primary" aria-busy={submitting}>{submitting ? 'Reservando…' : 'Confirmar turno'}</button>
      </div>

      {conflict && (
        <div className="overlay">
          <div className="sheet" role="alertdialog" aria-modal="true" aria-labelledby="conflict-title">
            <div className="grab" />
            <div className="hatch-badge" />
            <h2 id="conflict-title">Ese horario se acaba de ocupar</h2>
            <p>Otra clienta reservó el {longDate(flow.date).toLowerCase()} a las {hm(start)} mientras completabas tus datos. Elegí otro horario: tus datos quedan guardados.</p>
            <button type="button" className="btn-primary" autoFocus onClick={retry}>Ver horarios actualizados</button>
          </div>
        </div>
      )}
    </form>
  )
}
