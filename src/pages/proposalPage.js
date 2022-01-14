import {React, useState, useEffect} from 'react';
import Header from '../componment/header/header.js';
import Footer from '../componment/footer/footer.js';
import { Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import styled from 'styled-components';

const useStyles = makeStyles({
  formElement: {
    margin: '10px 0px 10px 0px'
  },
});

const FormWrapper = styled.div`
  display: flex;
  margin-top: 100px;    
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`
const StyledForm = styled.form`
  width: 750px;
  background: orange;
  text-align: center;

`

function ProposalPage() {
  const courseList=['제기개', '캡스톤 GE', '캡스톤 ICT'];

  const [teamName, setTeamName] = useState('');
  const [teamMember, setTeamMember] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [course, setCourse] = useState('');

  const [teamNameError, setTeamNameError] = useState(false);
  const [teamDescError, setTeamDescError] = useState(false);
  const [teamMemberError, setTeamMemberError] = useState(false);
  const [courseError, setCourseError] = useState(false);

  const style = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault()

    if(teamName === '') {
      setTeamNameError(true)
    }
    if(teamDesc === '') {
      setTeamDescError(true)
    }
    if(teamMember === '') {
      setTeamMemberError(true)
    }
    if(course === ''){
      setCourseError(true)
    }

    if(teamName && teamDesc && teamMember && course){
      console.log(teamName, teamDesc, teamMember, course)
    }
  }


  return (
    <div>
    <Header></Header>
    <FormWrapper>
      <StyledForm
        noValidate 
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <TextField
          onChange={(e) => {
            setTeamName(e.target.value)
            if(e.target.value !== ''){
              setTeamNameError(false)
            }
          }}
          label='Team Name'
          variant='outlined'
          color="primary"
          fullWidth
          required
          error={teamNameError}
          className={style.formElement}

        />  
        <FormControl
          fullWidth
          variant='outlined'
          style={{
            textAlign: 'left',
          }}
          className={style.formElement}
          error={courseError}
        >
          <InputLabel id="course-lable">Course</InputLabel>
          <Select
          
            labelId='course-lable'
            value={course}
            fullWidth
            onChange={(e) => {
              setCourse(e.target.value)
              if(e.target.value !== ''){
                setCourseError(false)
              }
            }}
            
          >
            {courseList.map((course, index)=> {
              return <MenuItem key={index} value={course}>{course}</MenuItem>
            })}
          </Select>
        </FormControl>
        <TextField
          onChange={(e) => {
            setTeamMember(e.target.value)
            if(e.target.value !== ''){
              setTeamMemberError(false)
            }
          }}
          label='Team Member: ex) 김한동 김둘동 김셋동'
          variant='outlined'
          color="primary"
          fullWidth
          required
          error={teamMemberError}
          className={style.formElement}
        />
        <TextField
          onChange={(e) => {
            setTeamDesc(e.target.value)
            if(e.target.value !== ''){
              setTeamDescError(false)
            }
          }}
          label='Team Description'
          variant='outlined'
          color='primary'
          required
          multiline
          fullWidth
          error={teamDescError}
          className={style.formElement}

        />
        <Button
          type='submit'
          variant='contained'
          style={{
            margin: '10px 0px 10px 0px'
          }}
        >
          Submit
        </Button>
      </StyledForm>
      </FormWrapper>

      <Footer></Footer>

    </div>

  );
}

export default ProposalPage;