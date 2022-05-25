import './SignUp.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import env from '../../env';

const SignUp: React.FC = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    error: '',
    success: false,
  });

  const auth = async () => {
    const response = await axios.post(`${env.api}/api/signup`, {
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    });
    return response;
  };

  const history = useNavigate();

  useEffect(() => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (accesstoken) {
      history('/stores');
    }
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    auth()
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('accesstoken', res.data.accesstoken);
          setState({ ...state, success: true, error: '' });
          history('/stores');
          return;
        }
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setState({ ...state, error: err.response.data.error });
      });
  };

  const showError = () => {
    return state.error ? <span className='error'>{state.error}</span> : '';
  };

  return (
    <div className='container'>
      <span>Cadastre-se para usar a aplicação</span>
      <form className='signup-form' onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={state.name}
          onChange={(e) => {
            setState({ ...state, name: e.target.value });
          }}
          placeholder='Insira o seu nome'
          required
        />
        <input
          type='email'
          name='email'
          value={state.email}
          onChange={(e) => {
            setState({ ...state, email: e.target.value });
          }}
          placeholder='Insira o seu email'
          required
        />
        <input
          type='password'
          name='password'
          value={state.password}
          onChange={(e) => {
            setState({ ...state, password: e.target.value });
          }}
          placeholder='Insira sua senha'
          required
        />
        <input
          type='password'
          name='passwordConfirmation'
          value={state.passwordConfirmation}
          onChange={(e) => {
            setState({ ...state, passwordConfirmation: e.target.value });
          }}
          placeholder='Repita sua senha'
          required
        />
        {showError()}
        <button type='submit'>Cadastrar</button>
      </form>
      <Link to='/login'>Já tem conta? Faça login!</Link>
    </div>
  );
};

export default SignUp;
