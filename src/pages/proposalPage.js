import {React, useState, useEffect} from 'react';
import Header from '../componment/header/header.js';
import Footer from '../componment/footer/footer.js';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import styled from 'styled-components';
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