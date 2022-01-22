import {React, useState, useEffect} from 'react';
import Header from '../componment/header/header.js';
import Contents from '../componment/contents/contents.js';
import Footer from '../componment/footer/footer.js';
import { SEMESTERS } from '../commons/constants';

function MainPage() {
  
  const [year, setYear] = useState(SEMESTERS[0]);

  return (
    <div>
      <Header></Header>
      <Contents year={year}></Contents>
      <Footer></Footer>
    </div>

  );
}

export default MainPage;