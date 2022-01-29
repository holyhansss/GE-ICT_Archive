import {React, useState, useEffect} from 'react';

import { Firestore } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import ReactTagInput from "@pathofdev/react-tag-input";

import "@pathofdev/react-tag-input/build/index.css";
import { Typography,Input, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import styled from 'styled-components';

import { ICT_COURSES, SEMESTERS, COURSE_REPORTS} from '../../commons/constants';

const useStyles = makeStyles({
  formElement: {
    margin: '10px 0px 10px 0px'
  },
  teamMemberEmail: {
    margin: '10px 5px 10px 0px',
    width: "30%"
  },
  teamMember: {
    margin: '10px 5px 10px 0px',
    width: "22%"
  },
  linkURL: {
    margin: '10px 5px 10px 0px',
    width: "70%"
  },
  filesTypography: {
    margin: '0px 30px 0px 0px'
  },
  inputImageButton: {
    margin: '20px 0px 0px 0px' 
  },
  memberPlueMinus: {
    margin: '0px 2px 2px 2px' 
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
  const style = useStyles();


  const [teamName, setTeamName] = useState('');
  const [countMember, setCountMember] = useState([0]);
  const [countLinks, setCountLinks] = useState([0]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 0,
      name: '',
      email: '',
      classOf: '',
      major: '',
    },
  ]);
  const [links, setLinks] = useState([
    {
      id: 0,
      name: '',
      link: '',
    },
  ]);

  const [teamDesc, setTeamDesc] = useState('');
  const [course, setCourse] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [tags, setTags] = useState(["example tag"])
  const [fileURLs, setFileURLs] = useState([
    {}
  ]);
  const [selectedFiles, setSelectedFiles] = useState([
    // {
    //   id: 0,
    //   fileName: '최종보고서',
    //   file: '',
    // },
    // {
    //   id: 1,
    //   fileName: '기말발표',
    //   file: '',
    // },
    // {
    //   id: 2,
    //   fileName: 'MVP',
    //   file: '',
    // }

  ]);

  const [teamNameError, setTeamNameError] = useState(false);
  const [teamDescError, setTeamDescError] = useState(false);
  const [teamMemberNameError, setTeamMemberNameError] = useState(false);
  const [teamMemberEmailError, setTeamMemberEmailError] = useState(false);
  const [teamMemberClassOfError, setTeamMemberClassOfError] = useState(false);
  const [teamMemberMajorError, setTeamMemberMajorError] = useState(false);

  const [courseError, setCourseError] = useState(false);
  const [selectedSemesterError, setSelectedSemesterError] = useState(false);


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
    if(teamMembers[0].classOf === ''){
      setTeamMemberClassOfError(true)
    }
    if(teamMembers[0].major === ''){
      setTeamMemberMajorError(true)
    }
    if(course === ''){
      setCourseError(true)
    }
    if(selectedSemester === ''){
      setSelectedSemesterError(true)
    }
    
    if(teamName && teamDesc && course && selectedSemester && teamMembers && selectedImage){
      //console.log(teamName, teamDesc, selectedSemester, teamMembers, course)
      const db = getFirestore();
      const storage = getStorage();
      const auth = getAuth();
      const fileURLssss = [];
      const date = new Date()
      const currentTime = date.getFullYear() + '' + (date.getMonth()+1) + '' +date.getDate() + '' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      console.log(currentTime);

      // upload main image
      let imageStorageRef = ref(storage, `images/${selectedImage.name}${currentTime}`)
      await uploadBytes(imageStorageRef, selectedImage)
      const imageURL = await getDownloadURL(imageStorageRef)
      //upload files
      for(let i=0; i<selectedFiles.length;i++ ){
        if(selectedFiles[i].file !== '' && selectedFiles[i].file !== undefined){
          let filename = selectedFiles[i].fileName;
          console.log(selectedFiles[i].fileName)
          let storageRef = ref(storage, `${selectedFiles[i].fileName}${currentTime}`);
          await uploadBytes(storageRef, selectedFiles[i].file)
          let URL = await getDownloadURL(storageRef)
          let newFile = {
            name: filename,
            URL: URL,
          }
          fileURLssss.push(newFile)
        }
      }
      

      const docRef = await addDoc(collection(db, 'Course Projects'), {
        teamName: teamName,
        project_description: teamDesc,
        semester: selectedSemester,
        image_url: imageURL,
        hashTag: tags,
        course: course,
        approved: false,
        owner: auth.currentUser.email,
      })
      // member 저장
      const memberCollectionRef = collection(docRef, 'members')
      teamMembers.map((memberInfo, index)=> {
        if(memberInfo.name !== '' && memberInfo.email !== ''){
          addDoc(memberCollectionRef, {
            name: memberInfo.name,
            email: memberInfo.email,
            classOf: memberInfo.classOf,
            major: memberInfo.major,
          })
        }
      })
      //FILES URL 링크들 저장
      const fileCollectionRef = collection(docRef, 'fileURLs')
      fileURLssss.map((fileURL, index) => 
        addDoc(fileCollectionRef, {
          name: fileURL.name,
          URL: fileURL.URL,
        })
      )
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
      classOf: '',
      major: '',
    }
    setTeamMembers(teamMembers.concat(newMember))
  }
  
  const addInputLinks = () => {
    let countArr = [...countLinks]
    let counter = countArr.slice(-1)[0]
  
    counter += 1
    countArr.push(counter)
    setCountLinks(countArr)
    addLinksArray()
  }

  const addLinksArray = () => {
    const newLink = {
      id: links.length,
      name: '',
      link: '',
    }
    setLinks(links.concat(newLink))
    console.log(links)
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

  const subInputLinks = () => {
    let countArr = [...countLinks]
    countArr.pop()
    if(links.length <= 1){

    }else {
      setCountLinks(countArr)
      subLinksArray() 
    }
  }
  const subLinksArray = () => {
    let linksArr = [...links]
    linksArr.pop()
    setLinks(linksArr)
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
  const handleMemberClassOfChange = (targetId, _classOf) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === targetId ? { ...member, classOf: _classOf } : member
      )
    )
  }
  const handleMemberMajorChange = (targetId, _major) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === targetId ? { ...member, major: _major } : member
      )
    )
  }
  const handleLinkNameChange = (targetId, _linkName) => {
    setLinks(
      links.map((link) =>
        link.id === targetId ? { ...link, name: _linkName } : link
      )
    )
  }
  const handleLinkURLChange = (targetId, _URL) => {
    setLinks(
      links.map((link) =>
        link.id === targetId ? { ...link, URL: _URL } : link
      )
    )
  }



  const handleFileChange = (targetId, _file) => {
    setSelectedFiles(
      selectedFiles.map((selectedFile) => 
        selectedFile.id === targetId ? { ...selectedFile, file: _file } : selectedFile
      )
    )
  }

  useEffect(() => {
    COURSE_REPORTS.map((report, index)=> {
      let reportObj = {
          id: index,
          fileName: report,
          file: '',
        }
      setSelectedFiles((reports) => [...reports, reportObj]);
    })
  },[])
  useEffect(() => {
    console.log(selectedFiles)
  },[selectedFiles])

  useEffect(() => {
  },[countMember,countLinks])

  useEffect(() => {
    if (selectedImage) {
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
          color='primary'
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
          <InputLabel id='course-lable'>Course</InputLabel>
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
            {ICT_COURSES.map((course, index)=> {
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
          <InputLabel id='year-lable'>수강 학기</InputLabel>
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
            {SEMESTERS.map((year, index)=> {
              return <MenuItem key={index} value={year}>{year}</MenuItem>
            })}
          </Select>
        </FormControl>
        <CreateInputMember>
        {countMember.map((item, index)=> {
          return (
            <div key={item}>
            <TextField
              key={"name" + index}
              name='name'
              onChange={(e) => {
                handleMemberNameChange(index, e.target.value)
                if(e.target.value !== ''){
                  setTeamMemberNameError(false)
                }
              }}
              label='Name'
              variant='outlined'
              color='primary'
              fullWidth
              required
              error={teamMemberNameError}
              className={style.teamMember}
            />
            <TextField
                key={"email" + index}
                onChange={(e) => {
                  handleMemberEmailChange(index, e.target.value)
                  if(e.target.value !== ''){
                    setTeamMemberEmailError(false)
                  }
                }}
                label='Email'
                variant='outlined'
                color='primary'
                fullWidth
                required
               error={teamMemberEmailError}
              className={style.teamMemberEmail}
            />
            <TextField
                key={"classOF" + index}
                onChange={(e) => {
                  handleMemberClassOfChange(index, e.target.value)
                  if(e.target.value !== ''){
                    setTeamMemberClassOfError(false)
                  }
                }}
                label='학번 ex) 19, 20'
                variant='outlined'
                color='primary'
                fullWidth
                required
               error={teamMemberClassOfError}
              className={style.teamMember}
            />
            <TextField
                key={"major" + index}
                onChange={(e) => {
                  handleMemberMajorChange(index, e.target.value)
                  if(e.target.value !== ''){
                    setTeamMemberMajorError(false)
                  }
                }}
                label='전공 ex. GE 전산'
                variant='outlined'
                color='primary'
                fullWidth
                required
               error={teamMemberMajorError}
              className={style.teamMember}
            />
            </div>

          );
        })}


        <Button 
          variant='outlined' 
          onClick={() => {
              addInputMember()
            }
          }
          className={style.memberPlueMinus}
        >
          +
        </Button>
        <Button 
          variant='outlined' 
          onClick={() => {
              subInputMember()
            }
          }
        className={style.memberPlueMinus}
        >
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
        <ReactTagInput 
          tags={tags}
          maxTags={10}
          removeOnBackspace={true}
          placeholder="HashTag: 단어 치구 Enter!"
          onChange={(newTags) => setTags(newTags)}
        />
        <CreateInputMember>
          {countLinks.map((item, index)=> {
            return (
              <div key={item}>
              <TextField
                key={"LinkName" + index}
                name='Link Name'
                onChange={(e) => {
                  handleLinkNameChange(index, e.target.value)
                  // if(e.target.value !== ''){
                  //   setTeamMemberNameError(false)
                  // }
                }}
                label='LINK NAME'
                variant='outlined'
                color='primary'
                fullWidth
                required
                //error={teamMemberNameError}
                className={style.teamMember}
              />
              <TextField
                  key={"LinkURL" + index}
                  onChange={(e) => {
                    handleLinkURLChange(index, e.target.value)
                    // if(e.target.value !== ''){
                    //   setTeamMemberEmailError(false)
                    // }
                  }}
                  label='Link URL'
                  variant='outlined'
                  color='primary'
                  fullWidth
                  required
                // error={teamMemberEmailError}
                  className={style.linkURL}
              />
              </div>

            );
          })}


          <Button 
            variant='outlined' 
            onClick={() => {
                addInputLinks()
              }
            }
            className={style.memberPlueMinus}
          >
            +
          </Button>
          <Button 
            variant='outlined' 
            onClick={() => {
                subInputLinks()
              }
            }
          className={style.memberPlueMinus}
          >
            -
          </Button>
        </CreateInputMember>


        <>
          <input
            accept='image/*'
            type='file'
            id='select-image'
            style={{ display: 'none' }}
            onChange={e => setSelectedImage(e.target.files[0])}
          />
          <label htmlFor='select-image'>
            <Button 
              variant='contained' 
              color='primary' 
              component='span'
              className={style.inputImageButton}
            >
              Upload Image
            </Button>
          </label>
          {imageUrl && selectedImage && (
            <Box mt={2} textAlign='center'>
              <div>Image Preview:</div>
              <img src={imageUrl} alt={selectedImage.name} height='300px' />
            </Box>
          )}
        </>
        <br></br>
        
        {COURSE_REPORTS.map((report, index)=> {
          return (
            <FilesWrapper key={index}>
              <Box sx={{
                width: 150,
              }}>
                <Typography className={style.filesTypography}>{report}</Typography>
              </Box>
              <Button 
                variant='contained'
                component='label'
                >
                <Input
                  type='file'
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