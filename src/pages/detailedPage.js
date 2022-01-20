import {React, useState, useEffect} from 'react';
import { useParams, useLocation } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import styled from 'styled-components';
import { getFirestore, collection, getDocs, doc} from 'firebase/firestore';

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

const TeamDesc = styled.div`
  margin: 0px 10% 0px 10%;
  margin-top: 40px;
  text-align: left;
`



const DetailPage = () => {
  const db = getFirestore();
  const location = useLocation();
  const { contentInfo, course } = location.state;
  const { id } = useParams();
  const [members, setMembers] = useState(null);


  //getMembers(course)
  //const teamMemberList = contentInfo.team_member.map();

  const getMembers = async (course) => {
  
    const membersRef = await doc(db, course, "aa", "members");
    console.log(membersRef)
  }
  //fetch memebrs, files and links
  useEffect(() => {
    const FetchContents = async () => {
        const data = await getDocs(collection(db, course, contentInfo.id, "members"));
        setMembers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));        
    };
    FetchContents();
  },[])


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
            <TeamDesc>Abstract : {contentInfo.project_description}</TeamDesc>
          </Content>
        </ContentWrapper>
        
      <Footer/>
    </div>
  );
};

export default DetailPage;