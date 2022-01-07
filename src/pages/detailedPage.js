import {React, useState, useEffect} from 'react';

import { useParams, useLocation } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';

const DetailPage = () => {
  const [content, setContent] = useState([]);
  const location = useLocation();
  const { contentInfo } = location.state;

  const { id } = useParams();
  return (
    <div>
      <Header/>
      <div>#{id}번째 포스aaa트</div>
      {console.log(contentInfo)}
      <Footer/>
    </div>
  );
};

export default DetailPage;