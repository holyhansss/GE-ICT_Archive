import {React, useState, useEffect} from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import ReactTagInput from '@pathofdev/react-tag-input';

import DetailedPageContent from '../componment/contents/detailPageContent'

const DetailPage = () => {

  return (
    
    <div>
      <Header/>
      <DetailedPageContent/>        
      <Footer/>
    </div>
  );
};

export default DetailPage;