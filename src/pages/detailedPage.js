import {React, useState, useEffect} from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import ReactTagInput from '@pathofdev/react-tag-input';

import { getFirestore, collection, getDocs, doc, updateDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { TextField, Button, makeStyles } from '@material-ui/core'
import styled from 'styled-components';
import oc from 'open-color';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const useStyles = makeStyles({
  download: {
    backgroundColor: 'gray',
    margin: '2.5px 0px 2.5px 0px',
    width: '35%',
  },
  downloadAnchor: {
    color: 'black',
    textDecoration: 'none',
    margin: '0px 0px 0px 10px',
  },
  linksContainer: {
    margin: '0px 0px 30px 0px',
  },
  URL: {
    color: 'black',
  },
  loginWarning: {
    padding: '3px 15px 3px 15px',
    backgroundColor: `${oc.gray[4]}`,
    fontSize: '13px', 
    borderRadius: '30px',
  },
  tags: {
    display: 'inline-block',
    color: 'black',
    backgroundColor: `${oc.gray[3]}`,
    borderRadius: '30px',
    fontSize: '13px',
    fontWeight: 'bold',
    margin: '20px 2.5px 0px 2.5px',
    padding: '2px 5px 2px 5px',
  },
  editButton: {
    color: 'black',
    backgroundColor: 'gray',
    height: '50px',
  },
  updateButton : {
    margin: '10px 0px 40% 0px'
  },
  formElement: {
    margin: '10px 0px 10px 0px'
  },
});

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
  align-items: center;

`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  color: black;
  margin-top: 100px;
  align-items: center;
`
const MainImage = styled.img`
  flex: 3;
  max-height: 400px;
  max-width: 100%;
  object-fit: contain;
`

const TeamName = styled.div`
  margin-top: 20px;
  font-size: 35px;
`

const SchoolOf = styled.div`
  font-size: 20px;
`
const TeamMembers = styled.div`
  margin-top: 10px;
`
const TeamMemberInfo = styled.div`

`

const ProjectDesc = styled.div`
  margin: 0px 10% 50px 10%;
  margin-top: 40px;
  text-align: left;
  
`



const DetailPage = () => {
  const style = useStyles();
  
  const db = getFirestore();
  const auth = getAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const { contentInfo, course } = location.state;
  const { id } = useParams();
  const [members, setMembers] = useState(null);
  const [files, setFiles] = useState(null);
  const [links, setLinks] = useState([]);

  // for editing
  const [edit, setEdit] = useState(false);
  const [teamName, setTeamName] = useState(contentInfo.teamName);
  const [teamDesc, setTeamDesc] = useState(contentInfo.project_description);
  const [tags, setTags] = useState(contentInfo.hashTag);
  const [editLinks, setEditLinks] = useState([]);

  //fetch memebrs, files and links
  useEffect(() => {
    const FetchContents = async () => {
        const memberData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "members"));
        setMembers(memberData.docs.map((doc) => ({...doc.data(), id: doc.id})));        
        const fileData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "fileURLs"));
        setFiles(fileData.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
        const linksData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "Links"));
        setLinks(linksData.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
        setEditLinks(linksData.docs.map((doc) => ({...doc.data(), id: doc.id})));
      };
    FetchContents();
  }, [contentInfo])

  useEffect(()=> {

  }, [edit]);

  const handleEditOnClick = () => {
    setEdit(true);
  };

  const handleUpdateOnClick = async () => {
    await updateDoc(doc(db, "Course Projects", contentInfo.id),{
      "teamName" : teamName,
      "project_description": teamDesc,
      "hashTag": tags,
    }).then(alert("updated!"))
    navigate("/")
    setEdit(false);
  }

  return (
    
    <div>
      <Header/>
        <ContentWrapper>
            {
              edit 
              ? <Content>
                  <TextField
                    onChange={(e) => {
                      setTeamName(e.target.value)
                      // if(e.target.value !== ''){
                      //   setTeamNameError(false)
                      // }
                    }}
                    value={teamName}
                    label='Team Name'
                    variant='outlined'
                    color='primary'
                    fullWidth
                    required
                    className={style.formElement}
                  />  
                  <TextField
                    onChange={(e) => {
                      setTeamDesc(e.target.value)
                      // if(e.target.value !== ''){
                      //   setTeamDescError(false)
                      // }
                    }}
                    label='Project Description'
                    variant='outlined'
                    color='primary'
                    value={teamDesc}
                    required
                    multiline
                    fullWidth
                    //error={teamDescError}
                    className={style.formElement}
                  />
                  <ReactTagInput 
                    tags={tags}
                    maxTags={10}
                    removeOnBackspace={true}
                    placeholder="HashTag: 단어 치구 Enter!"
                    onChange={(newTags) => {
                      if(newTags.length > 0){
                        newTags[newTags.length-1] = newTags[newTags.length-1].trim()
                      }
                      setTags(newTags)  
                    }}
                  />
                  <Button 
                    className={style.updateButton}
                    onClick={handleUpdateOnClick}
                  >
                    Update
                  </Button>
                </Content>
              : <Content>
                <MainImage src={contentInfo.image_url}/>
                <TeamName>{contentInfo.teamName}
                {
                  auth.currentUser 
                  ? contentInfo.owner === auth.currentUser.email
                    ? <Button className={style.editButton} onClick={handleEditOnClick}>Edit</Button>
                    : <div></div>
                  : <div></div>
                }
                </TeamName>
                <SchoolOf>{course} / {contentInfo.semester}</SchoolOf>
                <TeamMembers>
                  {
                    members == null 
                    ? <div></div>
                    : members.map((member, index) => 
                        <TeamMemberInfo key={index} >{member.name} / {member.major}({member.classOf})</TeamMemberInfo>
                    )
                  }
                </TeamMembers>
                <div>{
                        contentInfo.hashTag !== undefined ?
                        contentInfo.hashTag.map((tag, index)=> 
                        <div className={style.tags} key={index}>{tag}</div>
                        )
                        : <div></div>
                        }
                </div>
                <ProjectDesc>Abstract : {contentInfo.project_description}</ProjectDesc>
                {
                    auth.currentUser === null || !auth.currentUser.email.includes("@handong.edu")
                    ? (
                      <div className={style.loginWarning}>
                        <div>관련 자료 및 링크를 보기 위해서는 한동대학교 공식 이메일로 로그인 해주세요</div>
                        <div>Please log in with Handong official email to see the relevant data and links.</div>
                      </div>
                      )
                    : (
                      links.length === 0
                        ? <div></div>
                        : links.map((link, index) => {
                            if(link.name === '' && link.URL === '')
                              return <div key={index}></div>
                            else
                              return <div key={index} className={style.linksContainer}><a href={link.URL} target='_blank' className={style.URL}>{link.name}: {link.URL}</a></div>
                          })
                      )    
                }
                {
                    auth.currentUser === null || !auth.currentUser.email.includes("@handong.edu")
                    ? <div></div>
                    : (
                      files == null 
                        ? <div></div>
                        : files.map((file, index) => 
                        <Button key={index} className={style.download}>
                          <img src="https://img.icons8.com/material-sharp/18/000000/download--v1.png"/>
                          <a href={file.URL} target="_blank" className={style.downloadAnchor}>{file.name} Download</a>                
                        </Button>
                      ))
                }
              </Content>
            }
            
        </ContentWrapper>
        
      <Footer/>
    </div>
  );
};

export default DetailPage;