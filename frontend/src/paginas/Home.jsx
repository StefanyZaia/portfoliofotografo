import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAlbums } from "../services/api";

function Home() {
    const [albuns, setAlbuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAlbuns() {
            try {
                const data = await getAlbums();
                setAlbuns(data);
            } catch (error) {
                setErro("Não foi possível carregar os álbuns.");
            } finally {
                setLoading(false);
            }
        }

        carregarAlbuns();
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

                {loading && (
                    <div className="emptyState">
                        <h3>Carregando álbuns...</h3>
                        <p>Aguarde enquanto buscamos os registros publicados.</p>
                    </div>
                )}

                {!loading && erro && (
                    <div className="emptyState">
                        <h3>Erro ao carregar</h3>
                        <p>{erro}</p>
                    </div>
                )}

                {!loading && !erro && albuns.length === 0 && (
                    <div className="emptyState">
                        <h3>Nenhum álbum publicado ainda.</h3>
                        <p>
                            Em breve, os eventos, ensaios e sessões fotografadas aparecerão aqui.
                        </p>
                    </div>
                )}

                {!loading && !erro && albuns.length > 0 && (
                    <div className="albumsGrid">
                        {albuns.map((album) => (
                            <article className="albumCard" key={album.id}>
                                <img src={album.coverImage} alt={album.title} />

                                <div className="albumInfo">
                                    <span>{album.date}</span>
                                    <h3>{album.title}</h3>
                                    <p className="albumMeta">{album.location}</p>
                                    <p>{album.description}</p>
                                    <Link to={`/albuns/${album.id}`} className="albumButton">
                                        Ver álbum
                                    </Link>
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
                    <a
                        href="https://wa.me/5599999999999"
                        target="_blank"
                        rel="noreferrer"
                    >
                        WhatsApp
                    </a>

                    <a href="mailto:contato@email.com">
                        E-mail
                    </a>

                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Instagram
                    </a>

                    <Link to="/admin/login">
                        Área do fotógrafo
                    </Link>
                </div>
            </footer>
        </main>
    );
}

export default Home;