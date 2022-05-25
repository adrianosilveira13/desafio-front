import './Transactions.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type Transaction = {
  amount: number;
  card: string;
  date: string;
  description: string;
  document: string;
  signal: string;
  storename: string;
  type: string;
};

type TransactionsArray = Transaction[];

type LocationState = {
  storeId: number;
};

const Transactions: React.FC = () => {
  const [error, setError] = useState({
    message: '',
  });
  const [transactions, setTransactions] = useState<TransactionsArray>([]);
  const [total, setTotal] = useState(0);

  const history = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const titleCase = (str: string) => {
    let splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const loadTransactions = () => {
    const renderTransactions = () => {
      return transactions.map((transaction) => {
        return (
          <tr
            key={transaction.date}
            className={transaction.signal === '+' ? 'entrada' : 'saida'}
          >
            <td>{formatDate(transaction.date)}</td>
            <td>{titleCase(transaction.storename)}</td>
            <td>{titleCase(transaction.document)}</td>
            <td>{titleCase(transaction.description)}</td>
            <td>{titleCase(transaction.type)}</td>
            <td>R$ {transaction.amount.toFixed(2)}</td>
          </tr>
        );
      });
    };
    return renderTransactions();
  };

  useEffect(() => {
    const accesstoken = localStorage.getItem('accesstoken');
    if (!accesstoken) {
      setError({ ...error, message: 'Você não está logado' });
      return;
    }
    if (!state) {
      history('/stores');
    }
    if (state) {
      axios
        .get(`http://localhost:8080/api/transactions/${state.storeId}`, {
          headers: {
            accesstoken,
          },
        })
        .then((res) => {
          setTransactions(res.data.transactions);
          setTotal(res.data.total);
        })
        .catch(() => {
          setError({
            ...error,
            message: 'Algo deu errado, tente novamente mais tarde!',
          });
          return;
        });
    }
  }, []);

  return (
    <div className='container'>
      <div className='title'>Transações</div>
      {error.message || state === null ? (
        <>
          <div className='error'>{error.message}</div>
          <Link to='/login'>Clique aqui e faça login!</Link>
        </>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <td>Data</td>
                <td>Loja</td>
                <td>CPF</td>
                <td>Description</td>
                <td>Tipo</td>
                <td>Valor</td>
              </tr>
            </thead>
            <tbody>{loadTransactions()}</tbody>
          </table>
          <div className='total'>Total: {total.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
