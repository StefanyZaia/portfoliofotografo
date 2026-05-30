import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addPhotosToAlbum,
  createAlbum,
  deleteAlbum,
  deletePhoto,
  getAlbums,
  getImageUrl,
  updateAlbum,
} from "../services/api";

function Admin() {
  const [albuns, setAlbuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [erro, setErro] = useState("");
  const [albumFotosId, setAlbumFotosId] = useState("");
  const [albumEditando, setAlbumEditando] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    local: "",
    descricao: "",
    capa: null,
  });

  const [photoForm, setPhotoForm] = useState({
    albumId: "",
    photos: [],
  });

  const navigate = useNavigate();

  const albumSelecionado = albuns.find(
    (album) => String(album.id) === String(albumFotosId)
  );

  function sair() {
    localStorage.removeItem("@portfolio:token");
    navigate("/admin/login");
  }

  function limparFormularioAlbum() {
    setForm({
      titulo: "",
      data: "",
      local: "",
      descricao: "",
      capa: null,
    });

    setAlbumEditando(null);
    setFormKey((previousKey) => previousKey + 1);
  }

  function iniciarEdicao(album) {
    setErro("");
    setAlbumEditando(album);

    setForm({
      titulo: album.title,
      data: album.date,
      local: album.location,
      descricao: album.description,
      capa: null,
    });

    setFormKey((previousKey) => previousKey + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    limparFormularioAlbum();
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

    if (!albumEditando && !form.capa) {
      setErro("Selecione uma imagem de capa para o álbum.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const albumFormData = new FormData();

      albumFormData.append("title", form.titulo);
      albumFormData.append("date", form.data);
      albumFormData.append("location", form.local);
      albumFormData.append("description", form.descricao);

      if (form.capa) {
        albumFormData.append("coverImage", form.capa);
      }

      if (albumEditando) {
        await updateAlbum(albumEditando.id, albumFormData);
      } else {
        await createAlbum(albumFormData);
      }

      limparFormularioAlbum();

      await carregarAlbuns();
    } catch (error) {
      setErro(error.message || "Erro ao salvar álbum.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleUploadPhotos(event) {
    event.preventDefault();

    if (!photoForm.albumId) {
      setErro("Selecione um álbum para adicionar as fotos.");
      return;
    }

    if (!photoForm.photos || photoForm.photos.length === 0) {
      setErro("Selecione pelo menos uma foto.");
      return;
    }

    const formElement = event.currentTarget;

    try {
      setEnviandoFotos(true);
      setErro("");

      const photosFormData = new FormData();

      photoForm.photos.forEach((photo) => {
        photosFormData.append("photos", photo);
      });

      await addPhotosToAlbum(photoForm.albumId, photosFormData);

      setPhotoForm({
        albumId: "",
        photos: [],
      });

      formElement.reset();

      await carregarAlbuns();
    } catch (error) {
      setErro(error.message || "Erro ao adicionar fotos ao álbum.");
    } finally {
      setEnviandoFotos(false);
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

      if (String(albumFotosId) === String(id)) {
        setAlbumFotosId("");
      }

      if (albumEditando && String(albumEditando.id) === String(id)) {
        limparFormularioAlbum();
      }

      await carregarAlbuns();
    } catch (error) {
      setErro("Erro ao excluir álbum.");
    }
  }

  async function excluirFoto(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta foto?");

    if (!confirmar) {
      return;
    }

    try {
      setErro("");
      await deletePhoto(id);
      await carregarAlbuns();
    } catch (error) {
      setErro("Erro ao excluir foto.");
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
        <div className="adminForms">
          <form key={formKey} className="albumForm" onSubmit={handleSubmit}>
            <h2>{albumEditando ? "Editar álbum" : "Cadastrar novo álbum"}</h2>

            {albumEditando && (
              <p className="adminEmpty">
                Você está editando: <strong>{albumEditando.title}</strong>
              </p>
            )}

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
              required={!albumEditando}
            />

            {albumEditando && (
              <p className="adminEmpty">
                Deixe a capa em branco caso não queira trocar a imagem atual.
              </p>
            )}

            <textarea
              placeholder="Descrição do álbum"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required
            />

            <button type="submit" disabled={salvando}>
              {salvando
                ? "Salvando..."
                : albumEditando
                  ? "Salvar alterações"
                  : "Cadastrar álbum"}
            </button>

            {albumEditando && (
              <button
                type="button"
                className="cancelButton"
                onClick={cancelarEdicao}
              >
                Cancelar edição
              </button>
            )}
          </form>

          <form className="albumForm" onSubmit={handleUploadPhotos}>
            <h2>Adicionar fotos ao álbum</h2>

            <select
              value={photoForm.albumId}
              onChange={(e) =>
                setPhotoForm({ ...photoForm, albumId: e.target.value })
              }
              required
            >
              <option value="">Selecione um álbum</option>

              {albuns.map((album) => (
                <option value={album.id} key={album.id}>
                  {album.title}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) =>
                setPhotoForm({
                  ...photoForm,
                  photos: Array.from(e.target.files),
                })
              }
              required
            />

            <button type="submit" disabled={enviandoFotos}>
              {enviandoFotos ? "Enviando..." : "Adicionar fotos"}
            </button>
          </form>

          <div className="albumForm">
            <h2>Gerenciar fotos do álbum</h2>

            <select
              value={albumFotosId}
              onChange={(e) => setAlbumFotosId(e.target.value)}
            >
              <option value="">Selecione um álbum</option>

              {albuns.map((album) => (
                <option value={album.id} key={album.id}>
                  {album.title}
                </option>
              ))}
            </select>

            {!albumSelecionado ? (
              <p className="adminEmpty">
                Selecione um álbum para visualizar as fotos cadastradas.
              </p>
            ) : !albumSelecionado.photos || albumSelecionado.photos.length === 0 ? (
              <p className="adminEmpty">
                Este álbum ainda não possui fotos cadastradas.
              </p>
            ) : (
              <div className="adminPhotoGrid">
                {albumSelecionado.photos.map((photo) => (
                  <div className="adminPhotoItem" key={photo.id}>
                    <img
                      src={getImageUrl(photo.imageUrl)}
                      alt={`Foto do álbum ${albumSelecionado.title}`}
                    />

                    <button type="button" onClick={() => excluirFoto(photo.id)}>
                      Excluir foto
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                  <img src={getImageUrl(album.coverImage)} alt={album.title} />

                  <div>
                    <h3>{album.title}</h3>

                    <p>
                      {album.date} • {album.location}
                    </p>

                    <p>
                      {album.photos?.length || 0} foto
                      {(album.photos?.length || 0) === 1 ? "" : "s"} no álbum
                    </p>

                    <div className="adminAlbumActions">
                      <Link to={`/albuns/${album.id}`} className="smallLink">
                        Ver álbum
                      </Link>

                      <button type="button" onClick={() => iniciarEdicao(album)}>
                        Editar
                      </button>

                      <button type="button" onClick={() => excluirAlbum(album.id)}>
                        Excluir
                      </button>
                    </div>
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
