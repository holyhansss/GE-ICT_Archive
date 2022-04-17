import { React } from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getAuth } from 'firebase/auth';

import MainPage from './pages/mainPage';
import DetailPage from './pages/detailedPage';
import ProposalPage from './pages/proposalPage';
import SearchPage from './pages/searchPage';
import MyPage from './pages/myPage';
import ProfessorApprovalPage from './pages/professorApprovalPage';

function App() {
  //getAuth().signOut();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>} ></Route>
        <Route path='/detailpages/*' >
          <Route path=":id" element={<DetailPage />} />
        </Route>
        <Route path='/searchpage' element={<SearchPage/>} ></Route>
        <Route path='/proposalpage' element={<ProposalPage/>} ></Route>
        <Route path='/mypage' element={<MyPage/>} ></Route>  
        <Route path='/professorapprovalpage' element={<ProfessorApprovalPage/>} ></Route>  

      </Routes>
    </BrowserRouter>
  );
}

export default App;