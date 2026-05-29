import { useState } from "react";
import { Link } from "react-router-dom";

function Admin() {
  const [albuns, setAlbuns] = useState(() => {
    const albunsSalvos = localStorage.getItem("@portfolio:albuns");
    return albunsSalvos ? JSON.parse(albunsSalvos) : [];
  });

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    local: "",
    descricao: "",
    capa: "",
  });

  function salvarAlbuns(novosAlbuns) {
    setAlbuns(novosAlbuns);
    localStorage.setItem("@portfolio:albuns", JSON.stringify(novosAlbuns));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const novoAlbum = {
      id: Date.now(),
      ...form,
    };

    salvarAlbuns([...albuns, novoAlbum]);

    setForm({
      titulo: "",
      data: "",
      local: "",
      descricao: "",
      capa: "",
    });
  }

  function excluirAlbum(id) {
    const albunsAtualizados = albuns.filter((album) => album.id !== id);
    salvarAlbuns(albunsAtualizados);
  }

  return (
    <main className="adminPage">
      <header className="adminTopbar">
        <div>
          <p className="sectionLabel">Área do fotógrafo</p>
          <h1>Gerenciar álbuns</h1>
        </div>

        <Link to="/" className="backLink">
          Ver site
        </Link>
      </header>

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
            type="text"
            placeholder="URL da imagem de capa"
            value={form.capa}
            onChange={(e) => setForm({ ...form, capa: e.target.value })}
            required
          />

          <textarea
            placeholder="Descrição do álbum"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            required
          />

          <button type="submit">Cadastrar álbum</button>
        </form>

        <div className="adminAlbums">
          <h2>Álbuns cadastrados</h2>

          {albuns.length === 0 ? (
            <p className="adminEmpty">Nenhum álbum cadastrado ainda.</p>
          ) : (
            <div className="adminAlbumList">
              {albuns.map((album) => (
                <article className="adminAlbumItem" key={album.id}>
                  <img src={album.capa} alt={album.titulo} />

                  <div>
                    <h3>{album.titulo}</h3>
                    <p>{album.data} • {album.local}</p>
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
