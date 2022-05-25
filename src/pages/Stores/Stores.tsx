import './Stores.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
      setState({ ...state, error: 'Você não está logado' });
      return;
    }
    axios
      .get('http://localhost:8080/api/stores', {
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
          error: 'Algo deu errado, tente novamente mais tarde!',
        });
      });
  }, [state]);

  return (
    <div className='container'>
      <div className='title'>Lojas</div>
      {state.error ? (
        <>
          <div className='error'>{state.error}</div>
          <Link to='/login'>Clique aqui e faça login!</Link>
        </>
      ) : (
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
          <Link to='/logout'>Logout</Link>
        </>
      )}
    </div>
  );
};

export default Stores;
