const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'daw_db',
  password: 'daw_password',
  port: 5432,
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'DAW API running', features: ['audio-recording', 'projects'] });
});

// Audio recording endpoint
app.post('/api/recordings', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { projectId, title } = req.body;
    
    // Save to database
    const result = await pool.query(
      'INSERT INTO recordings (project_id, title, file_path, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [projectId, title, req.file.path, req.body.duration || 0]
    );

    res.json({ 
      success: true, 
      recording: result.rows[0],
      message: 'Audio recording saved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all recordings
app.get('/api/recordings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recordings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});