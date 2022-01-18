import {React, useState, useEffect} from 'react';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import InputMember from './inputMember';
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
  text-align: center;
`

const CreateInputMember = styled.div`
    width: 750px;
    text-align: center;
`

function ProposalForm() {
  const courseList=['제기개', '캡스톤 GE', '캡스톤 ICT'];

  const [teamName, setTeamName] = useState('');
  const [teamMember, setTeamMember] = useState('');
  const [countMember, setCountMember] = useState([0]);
  const [teamDesc, setTeamDesc] = useState('');
  const [course, setCourse] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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
  useEffect(() => {
    
    },[countMember])

  const addInputMember = () => {
    let countArr = [...countMember]
    let counter = countArr.slice(-1)[0]
    counter += 1
    countArr.push(counter)
    setCountMember(countArr)
  }

  useEffect(() => {
    if (selectedImage) {
      console.log(selectedImage)
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <div>
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
          required
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
        
        <CreateInputMember>
            <InputMember countMember={countMember}></InputMember>
            <Button variant="outlined" onClick={() => {
                addInputMember()
            }
            }>+</Button>
        </CreateInputMember>
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
        <>
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: 'none' }}
            onChange={e => setSelectedImage(e.target.files[0])}
          />
          <label htmlFor="select-image">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
          {imageUrl && selectedImage && (
            <Box mt={2} textAlign="center">
              <div>Image Preview:</div>
              <img src={imageUrl} alt={selectedImage.name} height="300px" />
            </Box>
          )}
        </>
        <Button
          type='submit'
          variant='contained'
          style={{
            margin: '10px 10px 10px 10px'
          }}
        >
          Submit
        </Button>
      </StyledForm>
      </FormWrapper>


    </div>

  );
}

export default ProposalForm;