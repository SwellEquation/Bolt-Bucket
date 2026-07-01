import { pool } from '../config/database.js'

const PRICE_MAP = {
  exterior_color: { black: 0, white: 0, silver: 0, blue: 500, red: 500, yellow: 1000 },
  wheel_type: { standard: 0, sport: 1500, offroad: 2000, luxury: 3000 },
  interior: { cloth: 0, leather: 2000, premium_leather: 4500 },
  engine: { standard: 0, v6: 3000, v8: 8000, electric: 12000 },
  performance_package: { none: 0, sport_exhaust: 1500, nitrous: 3500, turbo_kit: 4000 },
}
const BASE_PRICE = 25000

const calcPrice = ({ exterior_color, wheel_type, interior, engine, performance_package }) =>
  BASE_PRICE +
  (PRICE_MAP.exterior_color[exterior_color] ?? 0) +
  (PRICE_MAP.wheel_type[wheel_type] ?? 0) +
  (PRICE_MAP.interior[interior] ?? 0) +
  (PRICE_MAP.engine[engine] ?? 0) +
  (PRICE_MAP.performance_package[performance_package] ?? 0)

const validateCombo = (engine, performance_package) => {
  if (engine === 'electric' && performance_package === 'turbo_kit') {
    return 'Electric engines are incompatible with a turbo kit, electric motors cannot be turbocharged.'
  }
  return null
}

export const getCars = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM custom_cars ORDER BY id DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getCarById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM custom_cars WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Car not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createCar = async (req, res) => {
  const { name, exterior_color, wheel_type, interior, engine, performance_package } = req.body
  const comboError = validateCombo(engine, performance_package)
  if (comboError) return res.status(400).json({ error: comboError })
  const price = calcPrice({ exterior_color, wheel_type, interior, engine, performance_package })
  try {
    const { rows } = await pool.query(
      `INSERT INTO custom_cars (name, exterior_color, wheel_type, interior, engine, performance_package, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, exterior_color, wheel_type, interior, engine, performance_package, price]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateCar = async (req, res) => {
  const { name, exterior_color, wheel_type, interior, engine, performance_package } = req.body
  const comboError = validateCombo(engine, performance_package)
  if (comboError) return res.status(400).json({ error: comboError })
  const price = calcPrice({ exterior_color, wheel_type, interior, engine, performance_package })
  try {
    const { rows } = await pool.query(
      `UPDATE custom_cars
       SET name=$1, exterior_color=$2, wheel_type=$3, interior=$4, engine=$5, performance_package=$6, price=$7
       WHERE id=$8 RETURNING *`,
      [name, exterior_color, wheel_type, interior, engine, performance_package, price, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Car not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteCar = async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM custom_cars WHERE id = $1', [req.params.id])
    if (!rowCount) return res.status(404).json({ error: 'Car not found.' })
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}