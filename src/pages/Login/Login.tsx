import './Login.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import env from '../../env';

const Login: React.FC = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (accesstoken) {
      navigate('/stores');
    }
  }, []);

  const auth = async () => {
    const response = await axios.post(`${env.api}/api/login`, {
      email: state.email,
      password: state.password,
    });
    return response;
  };

  const history = useNavigate();

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
      <span>Faça Login!</span>
      <form className='signup-form' onSubmit={handleSubmit}>
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
        {showError()}
        <button type='submit'>Entrar</button>
      </form>
      <Link to='/signup'>Não tem conta? Cadastre-se!</Link>
    </div>
  );
};

export default Login;
