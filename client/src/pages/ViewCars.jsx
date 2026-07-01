import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const COLOR_HEX = {
  black: '#1a1a1a', white: '#f0f0f0', silver: '#a8a9ad',
  blue: '#1a4fc4', red: '#b00020', yellow: '#f5c518',
}

const ViewCars = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars')
      const data = await res.json()
      setCars(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    setCars((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) return <main style={{ justifyContent: 'center', padding: '2rem' }}><p>Loading...</p></main>

  return (
    <main style={{ flexDirection: 'column', padding: '2rem', alignItems: 'center' }}>
      <hgroup style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1>Custom Cars</h1>
        <p style={{ color: '#ccc' }}>{cars.length} car{cars.length !== 1 ? 's' : ''} saved</p>
      </hgroup>

      {cars.length === 0 ? (
        <p style={{ color: '#ccc' }}>No cars yet. <a href="/">Customize one!</a></p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1100px' }}>
          {cars.map((car) => (
            <article key={car.id} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              {/* Mini preview */}
              <div
                onClick={() => navigate(`/customcars/${car.id}`)}
                style={{
                  width: '100%', height: '90px', borderRadius: '10px 10px 4px 4px',
                  backgroundColor: COLOR_HEX[car.exterior_color] || '#555',
                  transition: 'background-color 0.3s', marginBottom: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <header style={{ paddingBottom: 0 }}>
                <h3 style={{ marginBottom: '0.25rem' }}>{car.name}</h3>
              </header>
              <p style={{ margin: '0.25rem 0', color: '#ccc', fontSize: '0.9rem' }}>
                {car.exterior_color} · {car.wheel_type} wheels · {car.engine.toUpperCase()} · {car.performance_package.replace('_', ' ')}
              </p>
              <p style={{ color: '#f5c518', fontWeight: 700, fontSize: '1.05rem', margin: '0.5rem 0' }}>
                ${Number(car.price).toLocaleString()}
              </p>
              <footer style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: 0, marginTop: 'auto' }}>
                <a href={`/customcars/${car.id}`} role="button" style={{ margin: 0, flex: '1 1 auto', textAlign: 'center' }}>Details</a>
                <a href={`/edit/${car.id}`} role="button" style={{ margin: 0, flex: '1 1 auto', textAlign: 'center' }}>Edit</a>
                <button className="secondary" onClick={() => handleDelete(car.id)} style={{ margin: 0, flex: '1 1 auto' }}>Delete</button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default ViewCars