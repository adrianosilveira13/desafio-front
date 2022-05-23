import './SignUp.css'

const SignUp: React.FC = () => {
  return (
    <div className="container">
      <span>Cadastre-se para usar a aplicação</span>
      <form className="signup-form" action="">
        <input type="text" name="name" placeholder="Insira o seu nome" required />
        <input type="email" name="email" placeholder="Insira o seu email" required />
        <input type="password" name="password" placeholder="Insira sua senha" required />
        <input type="password" name="passwordConfirmation" placeholder="Repita sua senha" required />
        <span className="error">Algo deu errado! Tente novamente mais tarde.</span>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export default SignUp;