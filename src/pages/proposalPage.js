import {React, useState, useEffect} from 'react';
import Header from '../componment/header/header.js';
import Contents from '../componment/contents/contents.js';
import Footer from '../componment/footer/footer.js';

function ProposalPage() {
  const [year, setYear] = useState(2021);

  return (
    <div>
      <Header></Header>
            this is proposal page
      <Footer></Footer>
    </div>

  );
}

export default ProposalPage;