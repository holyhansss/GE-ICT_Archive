import { React } from 'react';
import Header from '../componment/header/header.js';
import Footer from '../componment/footer/footer.js';
import ProposalForm from '../componment/proposalForm/proposalForm.js';


function ProposalPage() {
  return (
    <div>
      <Header></Header>
      <ProposalForm></ProposalForm>
      <Footer></Footer>
    </div>
  );
}

export default ProposalPage;