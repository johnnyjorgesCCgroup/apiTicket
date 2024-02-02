import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import pg from 'pg';

config();

const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Solo úsalo para propósitos de desarrollo, NO en producción
  },
});


// Middleware CORS
app.use(cors({
  origin: '*',
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
