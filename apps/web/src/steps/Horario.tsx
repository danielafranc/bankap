import { DS, MS, PROVIDER, SV, addDays, cap, durL, freeCount, getNow, hm, hoursOf, key, longDate, parse, slotsFor, type SlotStatus } from '@bankap/core'
import type { Flow, Say } from '../App.tsx'
import { store, useBookings } from '../data.ts'
import { Back } from '../icons.tsx'

interface Props { flow: Flow; patch: (p: Partial<Flow>) => void; say: Say; back: () => void; next: () => void }

const LUNCH_SPLIT = 780 // 13:00 separa mañana y tarde

export default function Horario({ flow, patch, say, back, next }: Props) {
  const bookings = useBookings()
  const sv = SV[flow.serviceId!]
  const { today } = getNow()
  const opt = { overbook: store.opts.overbooking }
  const free = (k: string) => (k < today ? 0 : freeCount(bookings, k, sv.dur, opt))
  const pick = (k: string) => patch({ date: k, start: null })

  // Vista mensual: el mes en curso (RN-11).
  const t = parse(today)
  const first = new Date(t.getFullYear(), t.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()

  const h = hoursOf(flow.date)
  const slots = slotsFor(bookings, flow.date, sv.dur, opt)
  const nf = slots.filter(x => x.st === 'free').length
  const none = !h || nf === 0
  const noneMsg = !h ? `Los domingos ${PROVIDER.first} no atiende. Elegí otro día.` : flow.date < today ? 'Ese día ya pasó.' : 'No quedan horarios libres para este servicio ese día. Probá con otro.'

  const tap = (x: { t: number; st: SlotStatus }) =>
    x.st === 'free' ? patch({ start: x.t }) : say(x.st === 'busy' ? 'Ese horario no está disponible para este servicio.' : 'Ese horario ya pasó.')

  const groups = none ? [] : ([['Mañana', slots.filter(x => x.t < LUNCH_SPLIT)], ['Tarde', slots.filter(x => x.t >= LUNCH_SPLIT)]] as const).filter(g => g[1].length)

  return (
    <>
      <main className="page">
        <div className="topbar">
          <button className="icon-btn" onClick={back} aria-label="Volver"><Back /></button>
          <h1>Fecha y hora</h1>
          <div />
        </div>
        <div className="month-head">
          <div>
            <h2>{cap(MS[t.getMonth()])}</h2>
            <p>{sv.name} · {durL(sv.dur)}</p>
          </div>
          <div className="seg" role="group" aria-label="Vista">
            <button aria-pressed={flow.view === 'semana'}
              onClick={() => patch({ view: 'semana', date: flow.date > addDays(today, 6) ? today : flow.date, start: null })}>7 días</button>
            <button aria-pressed={flow.view === 'mes'} onClick={() => patch({ view: 'mes' })}>Mes</button>
          </div>
        </div>

        {flow.view === 'semana' ? (
          <div className="week">
            {[...Array(7)].map((_, i) => {
              const k = addDays(today, i), d = parse(k)
              return (
                <button key={k} aria-pressed={k === flow.date} className={free(k) ? '' : 'full'} onClick={() => pick(k)} aria-label={longDate(k)}>
                  <span className="dow">{DS[d.getDay()]}</span><span className="num">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="month">
            <div className="month-grid month-dows" aria-hidden>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((x, i) => <span key={i}>{x}</span>)}</div>
            <div className="month-grid">
              {[...Array(offset)].map((_, i) => <span key={'e' + i} />)}
              {[...Array(daysInMonth)].map((_, i) => {
                const k = key(new Date(t.getFullYear(), t.getMonth(), i + 1))
                return (
                  <button key={k} aria-pressed={k === flow.date} className={free(k) ? '' : 'full'} onClick={() => pick(k)} aria-label={longDate(k)}>
                    {i + 1}<span className="mdot" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="legend" aria-hidden>
          <div><i style={{ background: '#fff', border: '1px solid rgba(29,26,33,.1)' }} />Libre</div>
          <div><i style={{ background: 'var(--grad)', border: '1px solid var(--sel-border)' }} />Elegido</div>
          <div><i style={{ background: 'repeating-linear-gradient(135deg, rgba(29,26,33,.18) 0 1.5px, transparent 1.5px 4px)' }} />Ocupado</div>
          <div><i style={{ border: '1px solid rgba(29,26,33,.12)' }} />Pasado</div>
        </div>

        <div className="day-label">{longDate(flow.date)} · {nf} {nf === 1 ? 'horario libre' : 'horarios libres'}</div>
        {none && <div className="empty">{noneMsg}</div>}
        {groups.map(([title, list]) => (
          <section key={title} className="slot-group">
            <h3>{title}</h3>
            <div className="slots">
              {list.map(x => {
                const on = x.t === flow.start && x.st === 'free'
                return (
                  <button key={x.t} className={`slot ${on ? 'on' : x.st}`} aria-pressed={on} aria-disabled={x.st !== 'free'} onClick={() => tap(x)}>
                    {hm(x.t)}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </main>
      <div className="cta-bar">
        <button className="btn-primary" aria-disabled={flow.start == null}
          onClick={() => (flow.start == null ? say('Elegí un horario para continuar.') : next())}>Continuar</button>
      </div>
    </>
  )
}
