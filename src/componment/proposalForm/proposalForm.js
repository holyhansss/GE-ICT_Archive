import {React, useState, useEffect} from 'react';
import { Typography,Input, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import { Firestore } from 'firebase/firestore';
import styled from 'styled-components';

const useStyles = makeStyles({
  formElement: {
    margin: '10px 0px 10px 0px'
  },
  teamMember: {
      margin: '10px 5px 10px 0px',
      width: '45%',
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
  const [semesters, setSemesters] = useState(['2022-1','2021-2','2021-1','2020-2','2020-1','2019-2','2019-1']);

  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 0,
      name: "",
      email: "",
    },
  ]);

  const [countMember, setCountMember] = useState([0]);

  const [teamDesc, setTeamDesc] = useState('');
  const [course, setCourse] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');

  const [teamNameError, setTeamNameError] = useState(false);
  const [teamDescError, setTeamDescError] = useState(false);
  const [teamMemberNameError, setTeamMemberNameError] = useState(false);
  const [teamMemberEmailError, setTeamMemberEmailError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [selectedSemesterError, setSelectedSemesterError] = useState(false);

  const style = useStyles();



  const handleSubmit = (e) => {
    e.preventDefault()

    if(teamName === '') {
      setTeamNameError(true)
    }
    if(teamDesc === '') {
      setTeamDescError(true)
    }
    if(teamMembers[0].name === '') {
      setTeamMemberNameError(true)
    }
    if(teamMembers[0].email === ''){
      setTeamMemberEmailError(true)
    }
    if(course === ''){
      setCourseError(true)
    }
    if(selectedSemester === ''){
      setSelectedSemesterError(true);
    }

    if(teamName && teamDesc && course){
      console.log(teamName, teamDesc, teamMembers, course)
    }
  }

  const addInputMember = () => {
    let countArr = [...countMember]
    let counter = countArr.slice(-1)[0]
  
    counter += 1
    countArr.push(counter)
    setCountMember(countArr)
    addTeamMembersArray()
  }

  const addTeamMembersArray = () => {
    const newMember = {
      id: teamMembers.length,
      name: '',
      email: '',
    }
    setTeamMembers(teamMembers.concat( newMember))
  }
  
  const handleMemberNameChange = (targetId, _name) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === targetId ? { ...member, name: _name } : member
      )
    )
  }
  const handleMemberEmailChange = (targetId, _email) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === targetId ? { ...member, email: _email } : member
      )
    )
  }
  
  //just for test
  // useEffect(() =>{
  //   console.log(teamMembers)
  // },[teamMembers])

  // useEffect(()=> {
  //   let currentYear = new Date().getFullYear();
  //   let currentMonth = new Date().getMonth();
  //   if(currentMonth>=8){
  //     currentMonth = 8
  //   }else{
  //     currentMonth = 7;
  //   }
    
  //    while(currentYear >= 2019){
  //     if(currentMonth>=8){
  //       setSemesters(...semesters,`${currentYear} - 2` )
  //       setSemesters(...semesters,`${currentYear} - 2`)
  //       currentMonth--;
  //     }else{
  //        setSemesters(...semesters,`${currentYear} - 1`)
  //       currentMonth++;
  //       currentYear--;
  //     }
  //    }
  //   console.log(semesters)
  // },[])

  useEffect(() => {
    
  },[countMember])

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
        <FormControl
          fullWidth
          variant='outlined'
          style={{
            textAlign: 'left',
          }}
          className={style.formElement}
          error={selectedSemesterError}
          required
        >
          <InputLabel id="year-lable">수강 학기</InputLabel>
          <Select
            labelId='year-lable'
            value={selectedSemester}
            fullWidth
            onChange={(e) => {
              setSelectedSemester(e.target.value)
              if(e.target.value !== ''){
                setSelectedSemesterError(false)
              }
            }}
          >
            {semesters.map((year, index)=> {
              return <MenuItem key={index} value={year}>{year}</MenuItem>
            })}
          </Select>
        </FormControl>
        <CreateInputMember>
        {countMember.map((item, index)=> {
          return (
            <div key={item}>
            <TextField
              key={`member ${index}`}
              name="name"
              onChange={(e) => {
                handleMemberNameChange(index, e.target.value)
                if(e.target.value !== ''){
                  setTeamMemberNameError(false)
                }
              }}
              label='Team Member Name'
              variant='outlined'
              color="primary"
              fullWidth
              required
              error={teamMemberNameError}
              className={style.teamMember}
            />
            <TextField
                key={index}
                onChange={(e) => {
                  handleMemberEmailChange(index, e.target.value)
                  if(e.target.value !== ''){
                    setTeamMemberEmailError(false)
                  }
                }}
                label='Email'
                variant='outlined'
                color="primary"
                fullWidth
                required
               error={teamMemberEmailError}
              className={style.teamMember}
            />
            </div>

          );
        })}


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
          label='Project Description'
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
        <br></br>
        <Typography>최종 보고서</Typography>
        <Button
          variant="contained"
          component="label"
          >
          <Input
            type="file"
            hidden
          />
        </Button>

        <br></br>

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