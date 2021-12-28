import {React, useState, useEffect} from 'react';
import Header from './componment/header/header.js';
import Contents from './componment/contents/contents.js';
import Footer from './componment/footer/footer.js';
import {firebase} from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore"

function App() {
  const [year, setYear] = useState(2021);
  const aa = async () => {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
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
