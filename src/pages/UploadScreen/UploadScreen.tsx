import './UploadScreen.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import env from '../../env';

const UploadScreen: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState({
    error: '',
    success: false,
  });

  const uploadHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      setFile(file);
    }
  };

  const history = useNavigate();

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const accesstoken = localStorage.getItem('accesstoken');
    const formData = new FormData();
    if (file !== null) {
      formData.append('file', file);
    }

    const res = await axios.post(`${env.api}/api/persist`, formData, {
      headers: {
        accesstoken: accesstoken ?? 'invalid access token',
      },
    });

    if (res.status === 204) {
      setState({
        ...state,
        success: true,
      });
    } else if (res.status === 400) {
      setState({
        ...state,
        error: 'Arquivo inválido, ou algo deu errado',
      });
    }
  };

  return (
    <div className='container'>
      <span>Somente arquivos .txt</span>
      <form className='upload-form' onSubmit={submitHandler}>
        <input type='file' name='file' onChange={uploadHandler} required />
        <button type='submit'>Salvar</button>
      </form>
      {state.success && (
        <>
          <p className='success'>Arquivo gravado com sucesso</p>
          <Link to='/stores'>Acessar lojas</Link>
        </>
      )}

      {state.error && (
        <>
          <p className='error'>{state.error}</p>
        </>
      )}
    </div>
  );
};

export default UploadScreen;
