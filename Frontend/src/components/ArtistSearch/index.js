import { FaSearch } from "react-icons/fa";
import styles from "./ArtistSearch.module.css";
import React, { useState } from "react";

const textExpanded = "Buscar Artista";
const textCollapsed = "Buscar novamente";

function ArtistSearch() {
  const [artistName, setArtistName] = useState('');
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState('');

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artist?name=${encodeURIComponent(artistName)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setArtistData(null);
      } else {
        setArtistData(data);
        setError('');
      }
    } catch (err) {
      setError('Erro ao buscar artista');
      setArtistData(null);
    }
  };

  return (
    <div className={styles.artistData}>
      <div className={`${styles.pageTitle} ${!artistData ? styles.titleExpanded : styles.pageTitle}`}>
        <h2>{artistData ? textCollapsed : textExpanded}</h2>
      </div>

      <div className={`${styles.searchBar} ${!artistData ? styles.expanded : styles.searchBar}`}>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Digite o nome do artista"
        />
        <button className={styles.buttonSearch} onClick={fetchArtist}>
          <FaSearch className={styles.faSearch} />
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {artistData && (
        <div>
          <h3 className={styles.artistDataName}>{artistData.nome}</h3>

          {artistData.imagem && (
            <a href={artistData.url} target="_blank" rel="noreferrer">
              <img src={artistData.imagem} alt={artistData.nome} className={styles.artistCover} />
            </a>
          )}

          <div className={styles.artistSongs}>
            <h3>Top músicas:</h3>
            <ul>
              {artistData.topMusicas.map((track, index) => (
                <li key={index} className={styles.songItem}>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.trackURL}
                  >
                    {track.imagem && (
                      <img
                        src={track.imagem}
                        alt={track.nome}
                        className={styles.songCover}
                      />
                    )}
                    <span className={styles.songText}>
                      {track.nome} ({track.album}) {track.dataLancamento}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.searchResultWrapper}>
            {artistData.albumMaisRecente && (
              <div className={styles.newAlbumInfo}>
                <h3>Álbum mais recente</h3>
                <a
                  href={artistData.albumMaisRecente.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.albumLink}
                >
                  {artistData.albumMaisRecente.imagem && (
                    <img
                      src={artistData.albumMaisRecente.imagem}
                      alt={artistData.albumMaisRecente.nome}
                      className={styles.newAlbumCover}
                    />
                  )}
                  <span>
                    {artistData.albumMaisRecente.nome} (
                    {new Date(artistData.albumMaisRecente.dataLancamento).toLocaleDateString('pt-BR')}
                    )
                  </span>
                </a>
              </div>
            )}

            {artistData.recomendacao && (
              <div className={styles.recommendation}>
                <h3>Artista Recomendado</h3>
                <a
                  href={artistData.recomendacao.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.albumLink}
                >
                  {artistData.recomendacao.imagem && (
                    <img
                      src={artistData.recomendacao.imagem}
                      alt={artistData.recomendacao.nome}
                      className={styles.newAlbumCover}
                    />
                  )}
                  <span>{artistData.recomendacao.nome}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistSearch;
