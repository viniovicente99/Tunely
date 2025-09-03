require('dotenv').config();
const axios = require('axios');

async function getAccessToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  );
  return response.data.access_token;
}

async function getArtistInfo(artistName) {
  const token = await getAccessToken();

  const searchRes = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: artistName, type: 'artist', limit: 1 }
  });
  const artist = searchRes.data.artists.items[0];
  if (!artist) throw new Error('Artista não encontrado.');

  const artistId = artist.id;
  const artistImage = artist.images[0]?.url || null;

  const topTracksRes = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { market: 'US' }
  });
  const topTracks = topTracksRes.data.tracks.slice(0, 5).map(track => ({
      nome: track.name,
      album: track.album.name,
      url: track.external_urls.spotify,
      imagem: track.album.images[0]?.url || null
  }));

  const albumsRes = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      include_groups: 'album',
      market: 'US',
      limit: 1
    }
  });
  const latestAlbum = albumsRes.data.items[0] || null;

  let recommendedArtist = null;

  
  try {
    const relatedRes = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (relatedRes.data.artists.length > 0) {
      recommendedArtist = relatedRes.data.artists[0];
    }
  } catch (err) {
    if (err.response?.status !== 404) throw err;
  }

  
  if (!recommendedArtist) {
   
    let query = artist.genres.length > 0 ? artist.genres[0] : artistName;

    const fallbackSearch = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'artist', limit: 5 }
    });

    
    const similarArtists = fallbackSearch.data.artists.items.filter(a => a.id !== artistId);

    if (similarArtists.length > 0) {
      recommendedArtist = similarArtists[0];
    }
  }

  return {
    nome: artist.name,
    imagem: artistImage,
    topMusicas: topTracks,
    albumMaisRecente: latestAlbum
      ? {
          nome: latestAlbum.name,
          dataLancamento: latestAlbum.release_date,
          url: latestAlbum.external_urls.spotify,
          imagem: latestAlbum.images[0]?.url || null
        }
      : null,
      recomendacao: recommendedArtist
  ? {
      nome: recommendedArtist.name,
      url: recommendedArtist.external_urls.spotify,
      imagem: recommendedArtist.images[0]?.url || null
    }
  : null

  };
}

module.exports = getArtistInfo;
