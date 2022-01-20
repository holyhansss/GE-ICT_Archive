import {React, useState, useEffect} from 'react';
import { useParams, useLocation } from "react-router-dom";
import Header from '../componment/header/header';
import Footer from '../componment/footer/footer';
import styled from 'styled-components';

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
  // background-color: orange;
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
  margin-top: 40px;
`

const Professor = styled.div`
  margin-top: 20px;

`
const TeamDesc = styled.div`
  margin: 0px 10% 0px 10%;
  margin-top: 40px;
  text-align: left;
`

const DetailPage = () => {
  const location = useLocation();
  const { contentInfo } = location.state;
  const { id } = useParams();

  //const teamMemberList = contentInfo.team_member.map();

  return (
    <div>
      <Header/>
        <ContentWrapper>
          <Content>
            <MainImage src={contentInfo.image_url}/>
            <TeamName>{contentInfo.teamName}</TeamName>
            <SchoolOf>{contentInfo.semester}</SchoolOf>
            <TeamMembers>{contentInfo.team_member}</TeamMembers>
            <TeamDesc>Abstract : <br/><br/>{contentInfo.project_description}</TeamDesc>
          </Content>
        </ContentWrapper>
        
      <Footer/>
    </div>
  );
};

export default DetailPage;