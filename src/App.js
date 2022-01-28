import { React } from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getAuth } from 'firebase/auth';

import MainPage from './pages/mainPage';
import DetailPage from './pages/detailedPage.js';
import ProposalPage from './pages/proposalPage.js';
import SearchPage from './pages/searchPage';

function App() {
  getAuth().signOut();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>} ></Route>
        <Route path='/detailpages/*' >
          <Route path=":id" element={<DetailPage />} />
        </Route>
        <Route path='/searchpage' element={<SearchPage/>} ></Route>
        <Route path='proposalpage/' element={<ProposalPage/>} ></Route>  
      </Routes>
    </BrowserRouter>
  );
}

export default App;