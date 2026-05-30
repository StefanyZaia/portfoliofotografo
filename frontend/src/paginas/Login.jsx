import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Login provisório só para testar o fluxo do frontend
    if (senha === "admin123") {
      localStorage.setItem("@portfolio:auth", "true");
      navigate("/admin");
      return;
    }

    setErro("Senha inválida.");
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
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <span className="loginError">{erro}</span>}

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}

export default Login;