import {React, useState, useEffect} from 'react';
import Header from './componment/header/header.js';
import Contents from './componment/contents/contents.js';
import Footer from './componment/footer/footer.js';
//import {firestore} from "./firebase.js";

function App() {
  const [year, setYear] = useState(2021);
  const aa = () => {
    //firestore.collection("example").add({text: "꿀잠 자기", completed: true});
  }

  return (
    <div>
      <Header></Header>
      <Contents year={year}></Contents>
      <Footer></Footer>
      <button onClick={aa}>aa</button>
    </div>

  );
}

export default App;
