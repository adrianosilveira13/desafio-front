import './UploadScreen.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    const res = await axios.post(
      'http://localhost:8080/api/persist',
      formData,
      {
        headers: {
          accesstoken: accesstoken ?? 'invalid access token',
        },
      }
    );

    if (res.status === 204) {
      
    } else if (res.status === 400) {
    }
  };

  return (
    <div className='container'>
      <span>Somente arquivos .txt</span>
      <form className='upload-form' onSubmit={submitHandler}>
        <input type='file' name='file' onChange={uploadHandler} required />
        <button type='submit'>Salvar</button>
      </form>
    </div>
  );
};

export default UploadScreen;
