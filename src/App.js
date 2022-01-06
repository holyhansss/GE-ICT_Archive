import { React } from 'react';
import Header from './componment/header/header.js';
import Contents from './componment/contents/contents.js';
import Footer from './componment/footer/footer.js';
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