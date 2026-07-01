import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'

const COLOR_HEX = {
  black: '#1a1a1a', white: '#f0f0f0', silver: '#a8a9ad',
  blue: '#1a4fc4', red: '#b00020', yellow: '#f5c518',
}

const FIELD_LABELS = {
  exterior_color: 'Exterior Color',
  wheel_type: 'Wheel Type',
  interior: 'Interior',
  engine: 'Engine',
  performance_package: 'Performance Package',
}

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((res) => { if (!res.ok) { setNotFound(true); return null } return res.json() })
      .then((data) => { if (data) setCar(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this car?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    navigate('/customcars')
  }

  if (loading) return <main style={{ justifyContent: 'center', padding: '2rem' }}><p>Loading...</p></main>
  if (notFound) return <main style={{ justifyContent: 'center', padding: '2rem' }}><p>Car not found. <a href="/customcars">Back to list</a></p></main>

  return (
    <main style={{ justifyContent: 'center', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Visual */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '280px', height: '170px',
          borderRadius: '18px 18px 8px 8px',
          backgroundColor: COLOR_HEX[car.exterior_color] || '#555',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          position: 'relative',
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '150px', height: '58px', background: 'rgba(150,220,255,0.35)',
            borderRadius: '10px 10px 4px 4px', border: '1px solid rgba(255,255,255,0.2)',
          }} />
          {[{ left: '30px' }, { right: '30px' }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '-14px', width: '42px', height: '42px',
              borderRadius: '50%',
              backgroundColor: car.wheel_type === 'luxury' ? '#c9a84c' : car.wheel_type === 'sport' ? '#333' : '#555',
              border: '3px solid #222', ...pos,
            }} />
          ))}
        </div>
        <h2 style={{ color: 'white', textAlign: 'center' }}>{car.name}</h2>
        <p style={{ color: '#f5c518', fontSize: '1.4rem', fontWeight: 700 }}>${Number(car.price).toLocaleString()}</p>
      </div>

      {/* Details */}
      <article style={{ minWidth: '280px', maxWidth: '420px', flex: 1 }}>
        <header><h2>Specs</h2></header>
        {Object.entries(FIELD_LABELS).map(([key, label]) => (
          <p key={key} style={{ margin: '0.4rem 0' }}>
            <strong>{label}:</strong> {String(car[key]).replace('_', ' ').charAt(0).toUpperCase() + String(car[key]).replace('_', ' ').slice(1)}
          </p>
        ))}
        <footer>
          <a href={`/edit/${car.id}`} role="button" style={{ marginLeft: 0 }}>Edit</a>
          <button className="secondary" onClick={handleDelete}>Delete</button>
          <a href="/customcars" role="button">← Back</a>
        </footer>
      </article>
    </main>
  )
}

export default CarDetails