import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAlbum, deleteAlbum, getAlbums } from "../services/api";

function Admin() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    local: "",
    descricao: "",
    capa: null,
  });

  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("@portfolio:auth");
    navigate("/admin/login");
  }

  async function carregarAlbuns() {
    try {
      setErro("");
      const data = await getAlbums();
      setAlbuns(data);
    } catch (error) {
      setErro("Não foi possível carregar os álbuns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlbuns();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.capa) {
      setErro("Selecione uma imagem de capa para o álbum.");
      return;
    }

    const formElement = event.currentTarget;

    try {
      setSalvando(true);
      setErro("");

      const albumFormData = new FormData();

      albumFormData.append("title", form.titulo);
      albumFormData.append("date", form.data);
      albumFormData.append("location", form.local);
      albumFormData.append("description", form.descricao);
      albumFormData.append("coverImage", form.capa);

      await createAlbum(albumFormData);

      setForm({
        titulo: "",
        data: "",
        local: "",
        descricao: "",
        capa: null,
      });

      formElement.reset();

      await carregarAlbuns();
    } catch (error) {
      setErro(error.message || "Erro ao cadastrar álbum.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAlbum(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este álbum?");

    if (!confirmar) {
      return;
    }

    try {
      setErro("");
      await deleteAlbum(id);
      await carregarAlbuns();
    } catch (error) {
      setErro("Erro ao excluir álbum.");
    }
  }

  return (
    <main className="adminPage">
      <header className="adminTopbar">
        <div>
          <p className="sectionLabel">Área do fotógrafo</p>
          <h1>Gerenciar álbuns</h1>
        </div>

        <div className="adminActions">
          <Link to="/" className="backLink">
            Ver site
          </Link>

          <button type="button" className="logoutButton" onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      {erro && (
        <div className="emptyState">
          <h3>Atenção</h3>
          <p>{erro}</p>
        </div>
      )}

      <section className="adminContent">
        <form className="albumForm" onSubmit={handleSubmit}>
          <h2>Cadastrar novo álbum</h2>

          <input
            type="text"
            placeholder="Nome do evento ou ensaio"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Local"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
            required
          />

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) =>
              setForm({ ...form, capa: e.target.files[0] || null })
            }
            required
          />

          <textarea
            placeholder="Descrição do álbum"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            required
          />

          <button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Cadastrar álbum"}
          </button>
        </form>

        <div className="adminAlbums">
          <h2>Álbuns cadastrados</h2>

          {loading ? (
            <p className="adminEmpty">Carregando álbuns...</p>
          ) : albuns.length === 0 ? (
            <p className="adminEmpty">Nenhum álbum cadastrado ainda.</p>
          ) : (
            <div className="adminAlbumList">
              {albuns.map((album) => (
                <article className="adminAlbumItem" key={album.id}>
                  <img src={album.coverImage} alt={album.title} />

                  <div>
                    <h3>{album.title}</h3>
                    <p>
                      {album.date} • {album.location}
                    </p>

                    <button onClick={() => excluirAlbum(album.id)}>
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Admin;