import { React } from 'react';
import {BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './pages/mainPage';
import DetailPage from './pages/detailedPage.js';
import ProposalPage from './pages/proposalPage.js';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<MainPage/>} ></Route>
        <Route exact path='/DetailPage' element={<DetailPage/>} ></Route>
        <Route exact path='/ProposalPage' element={<ProposalPage/>} ></Route>  
      </Routes>
    </BrowserRouter>
  );
}

export default App;