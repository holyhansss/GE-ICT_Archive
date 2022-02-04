import {React, useState, useEffect} from 'react';
import { useParams, useLocation } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import styled from 'styled-components';
import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { Button, makeStyles } from '@material-ui/core'

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
  }
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
  const location = useLocation();
  const { contentInfo, course } = location.state;
  const { id } = useParams();
  const [members, setMembers] = useState(null);
  const [files, setFiles] = useState(null);
  const [links, setLinks] = useState([]);
  //fetch memebrs, files and links
  useEffect(() => {
    const FetchContents = async () => {
        const memberData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "members"));
        setMembers(memberData.docs.map((doc) => ({...doc.data(), id: doc.id})));        
        const fileData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "fileURLs"));
        setFiles(fileData.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
        const linksData = await getDocs(collection(db, 'Course Projects', contentInfo.id, "Links"));
        setLinks(linksData.docs.map((doc) => ({...doc.data(), id: doc.id}))); 
      };
    FetchContents();
  },[contentInfo])


  return (
    
    <div>
      <Header/>
        <ContentWrapper>
          <Content>
            
            <MainImage src={contentInfo.image_url}/>

            <TeamName>{contentInfo.teamName}</TeamName>
            <SchoolOf>{course} / {contentInfo.semester}</SchoolOf>
            <TeamMembers>
              {
                members == null 
                ? <div></div>
                : members.map((member, index) => 
                    <TeamMemberInfo key={index} >{member.name} / {member.email} / {member.classOf}학번 / {member.major}</TeamMemberInfo>
                )
              }
            </TeamMembers>
            <ProjectDesc>Abstract : {contentInfo.project_description}</ProjectDesc>
            {
                links.length === 0
                ? <div></div>
                : links.map((link, index) => {
                    if(link.name === '' && link.URL === '')
                      return <div key={index}></div>
                    else
                      return <div key={index} className={style.linksContainer}>{link.name}: {link.URL}</div>
                  })
              }
            {
                files == null 
                ? <div></div>
                : files.map((file, index) => 
                <Button key={index} className={style.download}>
                  <img src="https://img.icons8.com/material-sharp/18/000000/download--v1.png"/>
                  <a href={file.URL} target="_blank" className={style.downloadAnchor}>{file.name} Download</a>                
                </Button>
                )
              }
              
          </Content>
        </ContentWrapper>
        
      <Footer/>
    </div>
  );
};

export default DetailPage;