import { useState } from "react";

function Home() {
  const [albuns] = useState(() => {
    const albunsSalvos = localStorage.getItem("@portfolio:albuns");
    return albunsSalvos ? JSON.parse(albunsSalvos) : [];
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="heroContent">
          <p className="heroLabel">Fotografia profissional</p>

          <h1>Registros naturais para momentos inesquecíveis.</h1>

          <span>
            Ensaios, eventos e histórias fotografadas com sensibilidade,
            luz e emoção.
          </span>

          <div className="heroButtons">
            <a href="#albuns">Ver portfólio</a>
            <a href="#contato">Entrar em contato</a>
          </div>
        </div>
      </section>

      <section id="albuns" className="albumsSection">
        <p className="sectionLabel">Portfólio</p>
        <h2>Álbuns recentes</h2>

        {albuns.length === 0 ? (
          <div className="emptyState">
            <h3>Nenhum álbum publicado ainda.</h3>
            <p>
              Em breve, os eventos, ensaios e sessões fotografadas aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="albumsGrid">
            {albuns.map((album) => (
              <article className="albumCard" key={album.id}>
                <img src={album.capa} alt={album.titulo} />

                <div className="albumInfo">
                  <span>{album.data}</span>
                  <h3>{album.titulo}</h3>
                  <p className="albumMeta">{album.local}</p>
                  <p>{album.descricao}</p>
                  <button>Ver álbum</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer id="contato">
        <p className="sectionLabel">Contato</p>
        <h2>Vamos registrar sua história?</h2>

        <p>
          Entre em contato para orçamentos, disponibilidade de datas e informações
          sobre ensaios ou eventos.
        </p>

        <div className="contacts">
          <a href="https://wa.me/5599999999999" target="_blank">
            WhatsApp
          </a>

          <a href="mailto:contato@email.com">
            E-mail
          </a>

          <a href="https://instagram.com/" target="_blank">
            Instagram
          </a>
        </div>
      </footer>
    </main>
  );
}

export default Home;
