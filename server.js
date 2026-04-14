const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_PASSWORD = '0000';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Middleware para autenticação
const authenticate = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  next();
};

// GET - Obter todos os dados
app.get('/api/data', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// GET - Obter dados sem autenticação (para site público)
app.get('/api/data/public', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// POST - Salvar dados (requer autenticação)
app.post('/api/data', authenticate, (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, message: 'Dados salvos com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});

// POST - Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-123' });
  } else {
    res.status(401).json({ success: false, error: 'Senha incorreta' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel admin em http://localhost:${PORT}/admin.html`);
  console.log(`🌐 Site principal em http://localhost:${PORT}`);
});
