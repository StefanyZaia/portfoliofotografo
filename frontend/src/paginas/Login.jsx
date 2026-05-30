import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setErro("");

      const data = await login(form.email, form.password);

      localStorage.setItem("@portfolio:token", data.token);

      navigate("/admin");
    } catch (error) {
      setErro(error.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="loginCard">
        <p className="sectionLabel">Área do fotógrafo</p>

        <h1>Acessar painel</h1>

        <p>
          Entre para gerenciar os álbuns, eventos e informações do portfólio.
        </p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {erro && <span className="loginError">{erro}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link to="/" className="albumBackLink">
          ← Voltar para o portfólio
        </Link>
      </section>
    </main>
  );
}

export default Login;