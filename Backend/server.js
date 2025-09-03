require('dotenv').config();
const express = require('express');
const path = require('path');
const getArtistInfo = require('./getArtist'); // tua função de integração com Spotify

const app = express();
const PORT = process.env.PORT || 3001;

// Rota da API
app.get('/api/artist', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Nome do artista é obrigatório.' });
  }

  try {
    const data = await getArtistInfo(name);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Servir o build do React (pasta Frontend/build)
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// Rota coringa para o React Router funcionar
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
