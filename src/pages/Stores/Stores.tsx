import './Stores.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import env from '../../env';

type Store = {
  id: number;
  storeName: string;
  owner: string;
};

type StoresArray = Store[];

const Stores: React.FC = () => {
  const [stores, setStores] = useState<StoresArray>([]);
  const [state, setState] = useState({
    error: '',
    authorized: true,
    content: true,
  });

  const history = useNavigate();

  const titleCase = (str: string) => {
    let splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  const handleClick = (id: number) => {
    history('/transactions', { state: { storeId: id } });
  };

  const logout = () => {
    localStorage.removeItem('accesstoken');
    history('/login');
  };

  const loadStores = () => {
    const renderStores = () => {
      return stores.map((store) => {
        return (
          <tr key={store.id} onClick={() => handleClick(store.id)}>
            <td>{titleCase(store.storeName)}</td>
            <td>{titleCase(store.owner)}</td>
          </tr>
        );
      });
    };
    return renderStores();
  };

  useEffect(() => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (!accesstoken) {
      setState({ ...state, error: 'Você não está logado', authorized: false });
      return;
    }
    axios
      .get(`${env.api}/api/stores`, {
        headers: {
          accesstoken,
        },
      })
      .then((res) => {
        setStores(res.data);
      })
      .catch(() => {
        setState({
          ...state,
          error: 'Algo deu errado, ou não há lojas cadastradas',
          content: false,
        });
      });
  }, [state]);

  return (
    <div className='container'>
      <div className='title'>Lojas</div>
      {!state.content && (
        <>
          <div className='error'>{state.error}</div>
          <Link to='/upload'>Clique aqui e carregue os dados!</Link>
        </>
      )}{' '}
      {!state.authorized && (
        <>
          <div className='error'>{state.error}</div>
          <Link to='/login'>Clique aqui e faça login!</Link>
        </>
      )}
      {state.authorized && state.content ? (
        <>
          <table>
            <thead>
              <tr>
                <td>Nome da Loja</td>
                <td>Dono</td>
              </tr>
            </thead>
            <tbody>{loadStores()}</tbody>
          </table>
          <Link to='/upload' className='addTransaction'>
            Adicionar mais transações
          </Link>
          <span className='logout' onClick={logout}>
            Logout
          </span>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Stores;
