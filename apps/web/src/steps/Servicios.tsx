import { CATEGORIES, PROVIDER, SERVICES, durL, money } from '@bankap/core'
import type { Flow, Say } from '../App.tsx'
import { Check } from '../icons.tsx'

interface Props { flow: Flow; patch: (p: Partial<Flow>) => void; say: Say; next: () => void }

export default function Servicios({ flow, patch, say, next }: Props) {
  const list = SERVICES.filter(s => flow.cat === 'Todos' || s.cat === flow.cat)
  return (
    <>
      <main className="page">
        <header className="hero">
          <div className="hero-text">
            <div>
              <h1>{PROVIDER.name}</h1>
              <div className="tagline">{PROVIDER.tagline}</div>
            </div>
            <div className="facts">
              <div><i className="dot" style={{ background: '#b893cf' }} />{PROVIDER.area}</div>
              <div><i className="dot" style={{ background: '#e9a98f' }} />{PROVIDER.hoursLabel}</div>
            </div>
          </div>
          <div className="photo" role="img" aria-label={`Foto de ${PROVIDER.name}`}>foto de perfil</div>
        </header>

        <h2 className="section-title">Elegí un servicio</h2>
        <div className="chips" role="group" aria-label="Categorías">
          {['Todos', ...CATEGORIES].map(c => (
            <button key={c} className="chip" aria-pressed={c === flow.cat} onClick={() => patch({ cat: c })}>{c}</button>
          ))}
        </div>
        <div className="services" role="radiogroup" aria-label="Servicios">
          {list.map(s => {
            const on = s.id === flow.serviceId
            return (
              <button key={s.id} className="service" role="radio" aria-checked={on} onClick={() => patch({ serviceId: s.id, start: null })}>
                <span className="check">{on && <Check />}</span>
                <span className="stack">
                  <span className="name">{s.name}</span>
                  <span className="meta">{durL(s.dur)} · {s.desc}</span>
                </span>
                <span className="price">{money(s.price)}</span>
              </button>
            )
          })}
        </div>
      </main>
      <div className="cta-bar">
        <button className="btn-primary" aria-disabled={!flow.serviceId}
          onClick={() => (flow.serviceId ? next() : say('Elegí un servicio para ver los horarios.'))}>
          Elegir horario
        </button>
      </div>
    </>
  )
}
