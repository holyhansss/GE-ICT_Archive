import {React, useState, useEffect} from 'react';
import { Typography,Input, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import { Firestore, snapshotEqual } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import styled from 'styled-components';

const useStyles = makeStyles({
  formElement: {
    margin: '10px 0px 10px 0px'
  },
  teamMember: {
      margin: '10px 5px 10px 0px',
      width: '45%',
  },
  filesTypography: {
    margin: '0px 30px 0px 0px'
  }
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

const FilesWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`


function ProposalForm() {
  const courseList=['제품 기획 및 개발', '캡스톤 GE', '캡스톤 ICT'];
  const [semesters, setSemesters] = useState(['2022-1','2021-2','2021-1','2020-2','2020-1','2019-2','2019-1']);
  const [reports, setReports] = useState(['최종보고서', '기말발표', 'MVP'])

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
  const [fileURLs, setFileURLs] = useState([
    {}
  ]);
  const [selectedFiles, setSelectedFiles] = useState([
    {
      id: 0,
      fileName: "최종보고서",
      file: "",
    },
    {
      id: 1,
      fileName: "기말발표",
      file: "",
    },
    {
      id: 2,
      fileName: "MVP",
      file: "",
    }

  ]);

  const [teamNameError, setTeamNameError] = useState(false);
  const [teamDescError, setTeamDescError] = useState(false);
  const [teamMemberNameError, setTeamMemberNameError] = useState(false);
  const [teamMemberEmailError, setTeamMemberEmailError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [selectedSemesterError, setSelectedSemesterError] = useState(false);

  const style = useStyles();

  const handleSubmit = async (e) => {
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
    
    if(teamName && teamDesc && course && selectedSemester && teamMembers && selectedImage){
      //console.log(teamName, teamDesc, selectedSemester, teamMembers, course)
      const db = getFirestore();
      const storage = getStorage();
      const fileURLssss = [];
      const now = Date().now;

      // upload main image
      let imageStorageRef = ref(storage, `images/${selectedImage.name}`)
      await uploadBytes(imageStorageRef, selectedImage)
      const imageURL = await getDownloadURL(imageStorageRef)
      //upload files
      for(let i=0; i<selectedFiles.length;i++ ){
        if(selectedFiles[i].file !== ''){
          let filename = selectedFiles[i].fileName;
          console.log(selectedFiles[i].fileName)
          let storageRef = ref(storage, `${selectedFiles[i].fileName}${now}`);
          await uploadBytes(storageRef, selectedFiles[i].file)
          let URL = await getDownloadURL(storageRef)
          let newFile = {
            name: filename,
            URL: URL,
          }
          fileURLssss.push(newFile)
        }
      }
      

      const docRef = await addDoc(collection(db, `${course}`), {
        teamName: teamName,
        project_description: teamDesc,
        semester: selectedSemester,
        image_url: imageURL,
      })
      // member 저장
      const memberCollectionRef = collection(docRef, "members")
      teamMembers.map((memberInfo, index)=> {
        if(memberInfo.name !== '' && memberInfo.email !== ''){
          addDoc(memberCollectionRef, {
            name: memberInfo.name,
            email: memberInfo.email,
          })
        }
      })
      //FILES URL 링크들 저장
      const fileCollectionRef = collection(docRef, "fileURLs")
      fileURLssss.map((fileURL, index) => {
        console.log(fileURL.name)
        console.log(fileURL.URL)
        console.log(index)
        addDoc(fileCollectionRef, {
          name: fileURL.name,
          URL: fileURL.URL,
        })
      })
      window.location.reload();

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
    setTeamMembers(teamMembers.concat(newMember))
  }

  const subInputMember = () => {
    let countArr = [...countMember]
    countArr.pop()
    if(teamMembers.length <= 1){

    }else {
      setCountMember(countArr)
      subTeamMembersArray() 
    }

    
  }
  const subTeamMembersArray = () => {
    let teamMemberArr = [...teamMembers]
    teamMemberArr.pop()
    setTeamMembers(teamMemberArr)
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
  
  const handleFileChange = (targetId, _file) => {
    console.log(targetId)
    setSelectedFiles(
      selectedFiles.map((selectedFile) => 
        selectedFile.id === targetId ? { ...selectedFile, file: _file } : selectedFile
      )
    )
  }
  
  // just for test
  // useEffect(() =>{
  //   console.log(teamMembers)
  // },[teamMembers])
  // useEffect(()=> {
  //   console.log(selectedFiles);
  // },[selectedFiles])

  useEffect(() => {
    
  },[countMember])

  useEffect(() => {
    if (selectedImage) {
      //console.log(selectedImage)
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
        }>
          +
        </Button>
        <Button variant="outlined" onClick={() => {
            subInputMember()
          }
        }>
          -
        </Button>
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
        
        {reports.map((report, index)=> {
          return (
            <FilesWrapper key={index}>
              <Box sx={{
                width: 150,
              }}>
                <Typography className={style.filesTypography}>{report}</Typography>
              </Box>
              <Button 
                variant="contained"
                component="label"
                >
                <Input
                  type="file"
                  hidden
                  onChange={(e)=> {
                    handleFileChange(index, e.target.files[0])
                  }}
                />
              </Button>
            </FilesWrapper>
          );
        })}
       
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