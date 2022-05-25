import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SIgnUp';
import Stores from './pages/Stores/Stores';
import Transactions from './pages/Transactions/Transactions';
import UploadScreen from './pages/UploadScreen/UploadScreen';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/upload' element={<UploadScreen />} />
        <Route path='/stores' element={<Stores />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
