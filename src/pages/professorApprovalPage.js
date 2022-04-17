import {React} from 'react';
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import ApprovalPageContent from '../componment/approvalPageContents/approvalPageContent';

function professorApprovalPage() {
  
  return (
    <div>
        <Header></Header>
        <ApprovalPageContent></ApprovalPageContent>
        <Footer></Footer>
    </div>

  );
}

export default professorApprovalPage;