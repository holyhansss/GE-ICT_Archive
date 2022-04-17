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




function ProposalForm() {
  const style = useStyles();


  const [teamName, setTeamName] = useState('');
  const [countMember, setCountMember] = useState([0]);
  const [countLinks, setCountLinks] = useState([0]);
  const [countFiles, setCountFiles] = useState([0]);

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
      URL: '',
    },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([
    {
      id: 0,
      fileName: '',
      file: '',
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


  const [teamNameError, setTeamNameError] = useState(false);
  const [teamDescError, setTeamDescError] = useState(false);
  const [teamMemberNameError, setTeamMemberNameError] = useState(false);
  const [teamMemberClassOfError, setTeamMemberClassOfError] = useState(false);

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
    if(teamMembers[0].classOf === ''){
      setTeamMemberClassOfError(true)
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
      const date = new Date();
      //const currentTime = date.getFullYear() + '' + (date.getMonth()+1) + '' +date.getDate() + '' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      const currentTime = Unix_timestampConv();
      //console.log(currentTime);
      
      // upload main image
      let imageStorageRef = ref(storage, `images/${selectedImage.name}${currentTime}`)
      await uploadBytes(imageStorageRef, selectedImage)
      const imageStorageURL = await getDownloadURL(imageStorageRef)
      //console.log(imageStorageURL);
      //upload files
      for(let i=0; i<selectedFiles.length;i++ ){
        if(selectedFiles[i].file !== '' && selectedFiles[i].file !== undefined){
          //console.log(selectedFiles[i])
          let filename = selectedFiles[i].fileName;
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
      
      const docRef = await addDoc(collection(db, 'CourseProjects'), {
        teamName: teamName,
        project_description: teamDesc,
        semester: selectedSemester,
        image_url: imageStorageURL,
        hashTag: tags,
        course: course,
        approved: false,
        owner: auth.currentUser.email,
        createdAt: currentTime,
      })
      // member 저장
      if(course !== 'IDEA CENTER'){
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
      }
      
      //FILES URL 링크들 저장
      const fileCollectionRef = collection(docRef, 'fileURLs')
      fileURLssss.map((fileURL, index) => 
        addDoc(fileCollectionRef, {
          name: fileURL.name,
          URL: fileURL.URL,
        })
      )
      // Link들 저장
      const LinksCollectionRef = collection(docRef, 'Links')
      links.map((link)=> {
        addDoc(LinksCollectionRef, {
          name: link.name,
          URL: link.URL,
        })
      })

      window.location.reload();

    } 

  }

  // control members
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

  // control links
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
      URL: '',
    }
    setLinks(links.concat(newLink))
    //console.log(links)
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

  // control files
  const addInputFiles = () => {
    let countArr = [...countFiles];
    let counter = countArr.slice(-1)[0];
  
    counter += 1;
    countArr.push(counter);
    setCountFiles(countArr);
    addFilesArray();
  }

  const addFilesArray = () => {
    const newLFile = {
      id: selectedFiles.length,
      fileName: '',
      file: '',
    }
    setSelectedFiles(selectedFiles.concat(newLFile))
    //console.log(selectedFiles)
  }

  const subInputFiles = () => {
    let countArr = [...countFiles]
    countArr.pop()
    if(selectedFiles.length <= 1){

    }else {
      setCountFiles(countArr)
      subFilesArray() 
    }
  }
  const subFilesArray = () => {
    let FilesArr = [...selectedFiles]
    FilesArr.pop()
    setSelectedFiles(FilesArr)
  }



  // handling changes
  const handleMemberNameChange = (targetId, _name) => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === targetId ? { ...member, name: _name } : member
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
  const handleFileNameChange = (targetId, _fileName) => {
    setSelectedFiles(
      selectedFiles.map((file) =>
        file.id === targetId ? { ...file, fileName: _fileName } : file
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

  function Unix_timestampConv()
  {
      return Math.floor(new Date().getTime() / 1000);
  }

  // useEffect(() => {
  //   if(selectedFiles.length === 0){
  //     COURSE_REPORTS.map((report, index)=> {
  //       let reportObj = {
  //           id: index,
  //           fileName: report,
  //           file: '',
  //         }
  //       setSelectedFiles((reports) => [...reports, reportObj]);
  //     })
  //   }
  // },[])
  
  useEffect(() => {
    //console.log(selectedFiles)
  },[selectedFiles])

  useEffect(() => {
  },[countMember,countLinks])

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
    //console.log(imageUrl)
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
          label='Title'
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
          {course !== 'IDEA CENTER'
          ? countMember.map((item, index)=> {
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
              {/* <TextField
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
              /> */}
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
              {/* <TextField
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
              /> */}
              </div>
  
            );
          })
          : <div></div>
          }
        

        {course !== 'IDEA CENTER'
        ?<div>
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
          </div>
        :<div></div>
        }
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
          onChange={(newTags) => {
            if(newTags.length>0){
              newTags[newTags.length-1] = newTags[newTags.length-1].trim()
            }
            setTags(newTags)  
          }}
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
                className={style.linkName}
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
              Upload Main Image*
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
        
        {/* {COURSE_REPORTS.map((report, index)=> {
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
        })} */}

        <CreateInputMember>
          {countFiles.map((item, index)=> {
            return (
              <div key={index} className={style.fileWrapper}> 
                <TextField
                  key={"FileName" + index}
                  name='File Name'
                  onChange={(e) => {
                    //handleLinkNameChange(index, e.target.value)
                    handleFileNameChange(index, e.target.value)
                  }}
                  label='File Name'
                  variant='outlined'
                  color='primary'
                  fullWidth
                  className={style.fileName}
                />
                <div
                  className={style.fileButton}  
                >
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
                </div>
              </div>

            );
          })}

          <Button 
            variant='outlined' 
            onClick={() => {
                addInputFiles()
              }
            }
            className={style.memberPlueMinus}
          >
            +
          </Button>
          <Button 
            variant='outlined' 
            onClick={() => {
                subInputFiles()
              }
            }
          className={style.memberPlueMinus}
          >
            -
          </Button>
        </CreateInputMember>

       
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

const useStyles = makeStyles({
  formElement: {
    margin: '10px 0px 10px 0px'
  },
  teamMember: {
    margin: '10px 5px 10px 0px',
    width: "30%"
  },
  linkName: {
    margin: '10px 5px 10px 0px',
    width: "22%"
  },
  linkURL: {
    margin: '10px 5px 10px 0px',
    width: "70%"
  },
  fileWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0px 10px 0px' 

  },
  fileName: {
    width:"22%",
    margin: '0px 10px 0px 0px',
  },
  fileButton: {
    
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