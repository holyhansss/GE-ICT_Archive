import Header from './componment/header/header.js'
import Contents from './componment/contents/contents.js'
import './App.css';
import {react, useState} from 'react';

function App() {
  const [year,setYear] = useState(2021);
  
  return (
    <div>
      <Header>hello</Header>
      <Contents year={year}></Contents>
      
      
    </div>

  );
}

export default App;
