import { useEffect, useRef, useState } from 'react'
import { SV, addDays, freeCount, getNow, type Booking } from '@bankap/core'
import { store } from './data.ts'
import Servicios from './steps/Servicios.tsx'
import Horario from './steps/Horario.tsx'
import Datos, { type FormState } from './steps/Datos.tsx'
import Listo from './steps/Listo.tsx'

export type Step = 'servicios' | 'horario' | 'datos' | 'listo'

export interface Flow {
  serviceId: string | null
  cat: string
  view: 'semana' | 'mes'
  date: string
  start: number | null
  form: FormState
  last: Booking | null
}

export type Say = (msg: string) => void

export default function App() {
  const [step, setStep] = useState<Step>('servicios')
  const [flow, setFlow] = useState<Flow>(() => ({
    serviceId: null, cat: 'Todos', view: 'semana', date: getNow().today, start: null,
    form: { name: '', phone: '', email: '' }, last: null,
  }))
  const patch = (p: Partial<Flow>) => setFlow(f => ({ ...f, ...p }))

  const [toast, setToast] = useState<string | null>(null)
  const tt = useRef<number | undefined>(undefined)
  const say: Say = msg => {
    clearTimeout(tt.current)
    setToast(msg)
    tt.current = window.setTimeout(() => setToast(null), 3000)
  }
  useEffect(() => () => clearTimeout(tt.current), [])

  const go = (s: Step) => {
    setStep(s)
    window.scrollTo(0, 0)
  }

  const toHorario = () => {
    if (!flow.serviceId) return
    // Arranca en el primer día con horarios libres de los próximos 7.
    const { today } = getNow()
    let date = flow.date
    for (let i = 0; i < 7; i++) {
      const k = addDays(today, i)
      if (freeCount(store.getAll(), k, SV[flow.serviceId].dur, { overbook: store.opts.overbooking })) { date = k; break }
    }
    patch({ date, start: null })
    go('horario')
  }

  return (
    <>
      {step === 'servicios' && <Servicios flow={flow} patch={patch} say={say} next={toHorario} />}
      {step === 'horario' && <Horario flow={flow} patch={patch} say={say} back={() => go('servicios')} next={() => go('datos')} />}
      {step === 'datos' && (
        <Datos flow={flow} patch={patch} back={() => go('horario')}
          done={b => { patch({ last: b }); go('listo') }}
          retry={() => { patch({ start: null }); go('horario') }} />
      )}
      {step === 'listo' && flow.last && (
        <Listo booking={flow.last} say={say}
          restart={() => { patch({ serviceId: null, start: null, cat: 'Todos', last: null }); go('servicios') }} />
      )}
      {toast && (
        <div className="toast-wrap" role="status" aria-live="polite"><div className="toast">{toast}</div></div>
      )}
    </>
  )
}
