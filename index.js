import express from 'express'
import {config} from 'dotenv'
const cors = require('cors');


import pg from 'pg'

config();

const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

app.use(cors({
  origin: 'http://localhost:5173', // Reemplaza con la URL real de tu frontend
  credentials: true,
}));

app.get('/',(req, res) => {
  res.send('Hello World')
})

app.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para obtener un ticket específico por ID
app.get('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para crear un nuevo ticket
app.post('/tickets', async (req, res) => {
  const { usuario, tipologia, urgente, comentario, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tickets (usuario, tipologia, urgente, comentario, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [usuario, tipologia, urgente, comentario, estado]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para actualizar un ticket existente por ID
app.put('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario, tipologia, urgente, comentario, estado } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tickets SET usuario = $1, tipologia = $2, urgente = $3, comentario = $4, estado = $5 WHERE id = $6 RETURNING *',
      [usuario, tipologia, urgente, comentario, estado, id]
    );
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ruta para eliminar un ticket por ID
app.delete('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar el servidor
app.listen(3006, () => {
  console.log('Server listening on port 3006');
});
