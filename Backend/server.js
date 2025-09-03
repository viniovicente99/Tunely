require('dotenv').config();
const express = require('express');
const path = require('path');
const getArtistInfo = require('./getArtist');

const app = express();
const PORT = process.env.PORT || 3001;

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


app.use(express.static(path.join(__dirname, '../Frontend/build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
