import { React } from 'react';
import Header from '../componment/header/header.js';
import Footer from '../componment/footer/footer.js';
import SearchContents from '../componment/search/searchContents.js';

function SearchPage() {
  

  return (
    <div>
      <Header/>
      <SearchContents/>
      <Footer/>
    </div>
  );
}

export default SearchPage;