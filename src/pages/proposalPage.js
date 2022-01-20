import { React } from 'react';
import Header from '../componment/header/header.js';
import Footer from '../componment/footer/footer.js';
import ProposalForm from '../componment/proposalForm/proposalForm.js';
import { getAuth } from "firebase/auth";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

function ProposalPage() {
  const auth = getAuth();
  if(auth.currentUser === null || !auth.currentUser.email.includes("@handong.edu")){
    return (
      <Alert severity="error">
        <AlertTitle>한동 로그인</AlertTitle>
        <strong>한동대학교 공식 이메일</strong>로 로그인해야 합니다.
      </Alert>
    );
  }

  return (
    <div>
      <Header/>
      <ProposalForm/>
      <Footer/>
    </div>
  );
}

export default ProposalPage;