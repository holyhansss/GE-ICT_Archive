import {React, useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from "react-router-dom";
import Header from '../header/header';
import Footer from '../footer/footer';
import ReactTagInput from '@pathofdev/react-tag-input';

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    query
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

import {TextField, makeStyles} from '@material-ui/core'
import styled from 'styled-components';
import oc from 'open-color';
import {
    Container,
    Form,
    Image,
    Tab,
    Tabs,
    Button
} from 'react-bootstrap';

const DetailPage = () => {
    const style = useStyles();

    const location = useLocation();
    const navigate = useNavigate();
    const {contentInfo, course} = location.state;
    const {id} = useParams();
    const [members, setMembers] = useState(null);
    const [files, setFiles] = useState(null);
    const [links, setLinks] = useState([]);

    // for editing
    const [edit, setEdit] = useState(false);

    useEffect(() => {}, [edit]);

    const handleEditClick = (bool) => {
        setEdit(bool);
    };

    return (
        <Container className='mt-5 d-flex'>
            <Container
                style={{
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    width: '100%',
                    textAlign: 'center',
                    alignItems: 'center'
                }}>
                {
                    edit
                        ? <EditDetail contentInfo={contentInfo} handleEditClick={handleEditClick}/>
                        : <ProjectDetail handleEditClick={handleEditClick}/>
                }

            </Container>
        </Container>
    );
};

const EditDetail = (props) => {

    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState(props.contentInfo.teamName);
    const [teamDesc, setTeamDesc] = useState(props.contentInfo.project_description);
    const [tags, setTags] = useState(props.contentInfo.hashTag);

    const handleUpdateOnClick = async () => {
        await updateDoc(doc(db, "CourseProjects", props.contentInfo.id), {
            "teamName": teamName,
            "project_description": teamDesc,
            "hashTag": tags
        }).then(alert("updated!"));
        navigate("/");
        props.handleEditClick(false);
    }
    return (
        <Container className='w-75'>
            <Form className="d-box my-3">
                <Form.Control
                    className='my-2'
                    type='title'
                    placeholder='Title *'
                    value={teamName}
                    required="required"
                    onChange={(e) => {
                        setTeamName(e.target.value);
                    }}
                    style={{
                        height: '50px'
                    }}/>
                <Form.Control
                    className='my-2'
                    type='description'
                    as='textarea'
                    placeholder='Project Description *'
                    required="required"
                    value={teamDesc}
                    onChange={(e) => {
                        setTeamDesc(e.target.value)
                    }}
                    style={{
                        height: '200px'
                    }}/>
                <ReactTagInput
                    tags={tags}
                    maxTags={10}
                    removeOnBackspace={true}
                    placeholder="HashTag: 단어 치고 Enter!"
                    onChange={(newTags) => {
                        if (newTags.length > 0) {
                            newTags[newTags.length - 1] = newTags[newTags.length - 1].trim()
                        }
                        setTags(newTags)
                    }}/>
                <Button className='mt-2' onClick={handleUpdateOnClick}>
                    Update
                </Button>

            </Form>

        </Container>
    );

}

const ProjectDetail = props => {

    const db = getFirestore();
    const auth = getAuth();

    const location = useLocation();
    const {contentInfo, course} = location.state;
    const {id} = useParams();
    const [members, setMembers] = useState(null);
    const [files, setFiles] = useState(null);
    const [links, setLinks] = useState([]);
    const [professors, setProfessors] = useState([]);

    useEffect(() => {
        const FetchContents = async () => {
            const memberData = await getDocs(
                collection(db, 'CourseProjects', contentInfo.id, "members")
            );
            setMembers(memberData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })));
            const fileData = await getDocs(
                collection(db, 'CourseProjects', contentInfo.id, "fileURLs")
            );
            setFiles(fileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })));
            const linksData = await getDocs(
                collection(db, 'CourseProjects', contentInfo.id, "Links")
            );
            setLinks(linksData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })));
            //setEditLinks(linksData.docs.map((doc) => ({...doc.data(), id: doc.id})));

            const professorData = await getDocs(query(collection(db, "professors")))
            professorData.forEach((professorInfo) => {
                setProfessors(professorList => [
                    ...professorList,
                    professorInfo
                        .data()
                        .email
                ])
            })
        };
        FetchContents();
    }, [contentInfo]);

    const passEdit = () => {
        props.handleEditClick(true);
    };

    return (
        <Container className='mb-5'>
            <Image
                src={contentInfo.image_url}
                fluid="fluid"
                style={{
                    maxHeight: '800px'
                }}/>

            <h1 className='mt-3'>{contentInfo.teamName}
                {
                    auth.currentUser
                        ? contentInfo.owner === auth.currentUser.email || professors.includes(
                            auth.currentUser.email
                        )
                            ? <Button className="ms-3" onClick={passEdit}>Edit</Button>
                            : <div></div>
                        : <div></div>
                }
            </h1>
            <h4 className='mb-4'>{course} / {contentInfo.semester}</h4>
            <Container style={{
                    width: '500px'
                }}>
                <Tabs
                    defaultActiveKey="Abstract"
                    transition={false}
                    id="noanim-tab"
                    className="mb-3">
                    <Tab eventKey="Abstract" title="Abstract">
                        {contentInfo.project_description}
                        <div>{
                                contentInfo.hashTag !== undefined
                                    ? contentInfo
                                        .hashTag
                                        .map(
                                            (tag, index) => <div
                                                className=""
                                                key={index}
                                                style={{
                                                    display: 'inline-block',
                                                    padding: "20px 5px 2px 5px",
                                                    fontSize: "13px",
                                                    fontWeight: "bold"
                                                }}>#{tag}</div>
                                        )
                                    : <div></div>
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="members" title="members">
                        <Container>
                            {
                                members === null
                                    ? <div>sss</div>
                                    : members.map(
                                        (member, index) => <TeamMemberInfo key={index}>{index + 1}. {member.name}({member.classOf})</TeamMemberInfo>
                                    )
                            }
                        </Container>
                    </Tab>
                    {
                        auth.currentUser === null || !auth
                            .currentUser
                            .email
                            .includes("@handong.ac.kr")
                                ? <Tab eventKey="files" title="files" disabled="disabled"></Tab>
                                : (
                                        files == null
                                        ? <div>No File Exist</div>
                                        : <Tab eventKey="files" title="files">
                                            {
                                                files.map(
                                                    (file, index) => <Button key={index} className="{style.download}">
                                                        <img src="https://img.icons8.com/material-sharp/18/000000/download--v1.png"/>
                                                        <a href={file.URL} target="_blank" className="{style.downloadAnchor}">{file.name}
                                                            Download</a>
                                                    </Button>
                                                )
                                            }</Tab>
                                    )
                    }
                    {
                        auth.currentUser === null || !auth
                            .currentUser
                            .email
                            .includes("@handong.ac.kr")
                                ? <Tab eventKey="links" title="links" disabled="disabled"></Tab>
                                : <Tab eventKey="links" title="links">
                                        {
                                            links.length === 0
                                                ? <div></div>
                                                : links.map((link, index) => {
                                                    if (link.name === '' && link.URL === '') 
                                                        return <div key={index}></div>
                                                    else 
                                                        return <div key={index} className="{style.linksContainer}">
                                                            <a href={link.URL} target='_blank' className="{style.URL}">{link.name}: {link.URL}</a>
                                                        </div>
                                                })
                                        }
                                    </Tab>
                    }
                </Tabs>
            </Container>



        </Container>
    );
}

export default DetailPage;

const useStyles = makeStyles({
    download: {
        backgroundColor: 'gray',
        margin: '2.5px 0px 2.5px 0px',
        width: '35%'
    },
    downloadAnchor: {
        color: 'black',
        textDecoration: 'none',
        margin: '0px 0px 0px 10px'
    },
    linksContainer: {
        margin: '0px 0px 30px 0px'
    },
    URL: {
        color: 'black'
    },
    loginWarning: {
        padding: '3px 15px 3px 15px',
        backgroundColor: `${oc.gray[4]}`,
        fontSize: '13px',
        borderRadius: '30px'
    },
    tags: {
        display: 'inline-block',
        color: 'black',
        backgroundColor: `${oc.gray[3]}`,
        borderRadius: '30px',
        fontSize: '13px',
        fontWeight: 'bold',
        margin: '20px 2.5px 0px 2.5px',
        padding: '2px 5px 2px 5px'
    },
    editButton: {
        color: 'black',
        margin: '0px 0px 5px 10px',
        backgroundColor: 'gray',
        height: '30px'
    },
    updateButton: {
        backgroundColor: 'skyblue',
        margin: '10px 0px 40% 0px'
    },
    formElement: {
        margin: '10px 0px 10px 0px'
    }
});

const ContentWrapper = styled.div `
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
    align-items: center;
  
  `
const Content = styled.div `
    display: flex;
    flex-direction: column;
    width: 60%;
    color: black;
    margin-top: 100px;
    align-items: center;
  `
const MainImage = styled.img `
    flex: 3;
    max-height: 800px;
    max-width: 100%;
    object-fit: contain;
  `

const TeamName = styled.div `
    margin-top: 20px;
    font-size: 35px;
  `

const SchoolOf = styled.div `
    font-size: 20px;
  `
const TeamMembers = styled.div `
    margin-top: 10px;
  `
const TeamMemberInfo = styled.div `
  
  `

const ProjectDesc = styled.div `
    margin: 0px 10% 50px 10%;
    margin-top: 40px;
    text-align: left;
    
  `
