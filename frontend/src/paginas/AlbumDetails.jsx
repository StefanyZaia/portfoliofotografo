import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbumById, getImageUrl } from "../services/api";


// Página de detalhes de um álbum específico, mostrando suas fotos e informações
function AlbumDetails() {
  const { id } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAlbum() {
      try {
        const data = await getAlbumById(id);
        setAlbum(data);
      } catch (error) {
        setErro("Não foi possível carregar este álbum.");
      } finally {
        setLoading(false);
      }
    }

    carregarAlbum();
  }, [id]);

  // Exibe estados de carregamento, erro ou o conteúdo do álbum
  if (loading) {
    return (
      <main className="albumDetailsPage">
        <div className="emptyState">
          <h3>Carregando álbum...</h3>
          <p>Aguarde enquanto buscamos as fotos.</p>
        </div>
      </main>
    );
  }

  // Se houve um erro ou o álbum não foi encontrado, exibe uma mensagem apropriada
  if (erro || !album) {
    return (
      <main className="albumDetailsPage">
        <div className="emptyState">
          <h3>Álbum não encontrado</h3>
          <p>{erro || "Não foi possível encontrar este álbum."}</p>

          <Link to="/" className="backLink">
            Voltar para o início
          </Link>
        </div>
      </main>
    );
  }

  // Exibe os detalhes do álbum e a galeria de fotos
  return (
    <main className="albumDetailsPage">
      <section className="albumHero">
        <img src={getImageUrl(album.coverImage)} alt={album.title} />

        <div className="albumHeroOverlay">
          <Link to="/" className="albumBackLink">
            ← Voltar para o portfólio
          </Link>

          <p className="sectionLabel">Álbum fotográfico</p>
          <h1>{album.title}</h1>

          <p className="albumDetailsMeta">
            {album.date} • {album.location}
          </p>

          <p className="albumDetailsDescription">{album.description}</p>
        </div>
      </section>

      <section className="gallerySection">
        <p className="sectionLabel">Galeria</p>
        <h2>Registros do álbum</h2>

        {!album.photos || album.photos.length === 0 ? (
          <div className="emptyState">
            <h3>Nenhuma foto adicionada ainda.</h3>
            <p>
              Quando o fotógrafo adicionar fotos a este álbum, elas aparecerão
              aqui.
            </p>
          </div>
        ) : (
          <div className="photoGallery">
            {album.photos.map((photo) => (
              <figure className="photoItem" key={photo.id}>
                <img src={getImageUrl(photo.imageUrl)} alt={`Foto do álbum ${album.title}`} />
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AlbumDetails;
