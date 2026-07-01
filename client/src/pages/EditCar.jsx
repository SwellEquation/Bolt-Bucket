import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'

const PRICE_MAP = {
  exterior_color: { black: 0, white: 0, silver: 0, blue: 500, red: 500, yellow: 1000 },
  wheel_type: { standard: 0, sport: 1500, offroad: 2000, luxury: 3000 },
  interior: { cloth: 0, leather: 2000, premium_leather: 4500 },
  engine: { standard: 0, v6: 3000, v8: 8000, electric: 12000 },
  performance_package: { none: 0, sport_exhaust: 1500, nitrous: 3500, turbo_kit: 4000 },
}
const BASE_PRICE = 25000

const COLOR_HEX = {
  black: '#1a1a1a', white: '#f0f0f0', silver: '#a8a9ad',
  blue: '#1a4fc4', red: '#b00020', yellow: '#f5c518',
}

const calcPrice = (form) =>
  BASE_PRICE +
  (PRICE_MAP.exterior_color[form.exterior_color] ?? 0) +
  (PRICE_MAP.wheel_type[form.wheel_type] ?? 0) +
  (PRICE_MAP.interior[form.interior] ?? 0) +
  (PRICE_MAP.engine[form.engine] ?? 0) +
  (PRICE_MAP.performance_package[form.performance_package] ?? 0)

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((res) => res.json())
      .then((data) => setForm({
        name: data.name,
        exterior_color: data.exterior_color,
        wheel_type: data.wheel_type,
        interior: data.interior,
        engine: data.engine,
        performance_package: data.performance_package,
      }))
      .catch(console.error)
  }, [id])

  if (!form) return <main style={{ justifyContent: 'center', padding: '2rem' }}><p>Loading...</p></main>

  const price = calcPrice(form)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please give your car a name.'); return }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      navigate(`/customcars/${id}`)
    } catch {
      setError('Could not connect to the server.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={{ justifyContent: 'center', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Color Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: '260px' }}>
        <div style={{
          width: '260px', height: '160px',
          borderRadius: '18px 18px 8px 8px',
          backgroundColor: COLOR_HEX[form.exterior_color],
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          transition: 'background-color 0.4s ease',
          position: 'relative',
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{
            position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)',
            width: '140px', height: '55px', background: 'rgba(150,220,255,0.35)',
            borderRadius: '10px 10px 4px 4px', border: '1px solid rgba(255,255,255,0.2)',
          }} />
          {[{ left: '28px' }, { right: '28px' }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '-14px', width: '40px', height: '40px',
              borderRadius: '50%',
              backgroundColor: form.wheel_type === 'luxury' ? '#c9a84c' : form.wheel_type === 'sport' ? '#333' : '#555',
              border: '3px solid #222', ...pos,
            }} />
          ))}
        </div>
        <hgroup style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: 0 }}>{form.name || 'Your Custom Car'}</h2>
          <p style={{ color: '#ccc', fontSize: '1.1rem' }}>Estimated Price: <strong style={{ color: '#f5c518' }}>${price.toLocaleString()}</strong></p>
        </hgroup>
      </div>

      {/* Form */}
      <article style={{ minWidth: '300px', maxWidth: '480px', flex: 1 }}>
        <header><h2>Edit Car</h2></header>
        {error && <p style={{ color: '#ff6b6b', fontWeight: 600 }}>⚠ {error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Car Name
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Midnight Racer" required />
          </label>

          <label>Exterior Color
            <select name="exterior_color" value={form.exterior_color} onChange={handleChange}>
              {Object.entries(PRICE_MAP.exterior_color).map(([k, v]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}{v > 0 ? ` (+$${v.toLocaleString()})` : ''}</option>
              ))}
            </select>
          </label>

          <label>Wheel Type
            <select name="wheel_type" value={form.wheel_type} onChange={handleChange}>
              {Object.entries(PRICE_MAP.wheel_type).map(([k, v]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}{v > 0 ? ` (+$${v.toLocaleString()})` : ''}</option>
              ))}
            </select>
          </label>

          <label>Interior
            <select name="interior" value={form.interior} onChange={handleChange}>
              {Object.entries(PRICE_MAP.interior).map(([k, v]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}{v > 0 ? ` (+$${v.toLocaleString()})` : ''}</option>
              ))}
            </select>
          </label>

          <label>Engine
            <select name="engine" value={form.engine} onChange={handleChange}>
              {Object.entries(PRICE_MAP.engine).map(([k, v]) => (
                <option key={k} value={k}>{k.toUpperCase().replace('_', ' ')}{v > 0 ? ` (+$${v.toLocaleString()})` : ''}</option>
              ))}
            </select>
          </label>

          <label>Performance Package
            <select name="performance_package" value={form.performance_package} onChange={handleChange}>
              {Object.entries(PRICE_MAP.performance_package).map(([k, v]) => (
                <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}{v > 0 ? ` (+$${v.toLocaleString()})` : ''}</option>
              ))}
            </select>
          </label>

          <input type="submit" value={submitting ? 'Saving...' : `Save Changes — $${price.toLocaleString()}`} disabled={submitting} />
          <a href={`/customcars/${id}`} role="button" style={{ background: 'transparent', color: '#ccc' }}>Cancel</a>
        </form>
      </article>
    </main>
  )
}

export default EditCar