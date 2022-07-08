import { React, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactTagInput from '@pathofdev/react-tag-input';

import { getFirestore, collection, getDocs, doc, updateDoc, query, setDoc, addDoc, deleteDoc, } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Container, Form, Image, Tab, Tabs, Button, Row } from 'react-bootstrap';

const DetailPage = () => {

    const db = getFirestore();

    const location = useLocation();
    const { contentInfo, course } = location.state;
    const { id } = useParams();

    const [members, setMembers] = useState(null);
    const [files, setFiles] = useState(null);
    const [links, setLinks] = useState([]);
    const [professors, setProfessors] = useState([]);

    const [countLinks, setCountLinks] = useState([0]);

    // for editing
    const [edit, setEdit] = useState(false);

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
            setLinks(linksData.docs.map((doc, index) => ({
                ...doc.data(),
                //id: doc.id
                id: index,
                uid: doc.id
            })));

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


    useEffect(() => { }, [edit]);

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
                        ? <EditDetail 
                            contentInfo={contentInfo} 
                            course={course} 
                            members={members} 
                            files={files} 
                            links={links} 
                            professors={professors} 
                            handleEditClick={handleEditClick} />
                        : <ProjectDetail 
                            contentInfo={contentInfo} 
                            course={course} 
                            members={members} 
                            files={files} 
                            links={links} 
                            professors={professors} 
                            handleEditClick={handleEditClick} />
                }
            </Container>
        </Container>
    );
};



const ProjectDetail = props => {

    const db = getFirestore();
    const auth = getAuth();
    const [contentInfo, setContentInfo] = useState(props.contentInfo);
    const members = props.members;
    const files = props.files;
    const links = props.links;
    const professors = props.professors;
    const course = props.course;
    
    const passEdit = () => {
        props.handleEditClick(true);
    };

    return (
        <Container className='mb-5'>
            <Image
                src={contentInfo.image_url}
                fluid="fluid"
                style={{
                    maxHeight: '600px'
                }} />

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
                                    ? <div>No Members</div>
                                    : members.map(
                                        (member, index) => <div key={index}>{index + 1}. {member.name}({member.classOf})</div>
                                    )
                            }
                        </Container>
                    </Tab>
                    {
                        auth.currentUser === null || !auth
                            .currentUser
                            .email
                            .includes("@handong.ac.kr")
                            ? <Tab eventKey="files" title="files" disabled={true}></Tab>
                            : (
                                files == null
                                    ? <div>No File Exist</div>
                                    : <Tab eventKey="files" title="files">
                                        {
                                            files.map(
                                                (file, index) => <Row key={index} md='auto' className='my-2' style={{ width: '50%' }}><Button className="" variant='secondary'>
                                                    <img src="https://img.icons8.com/material-sharp/18/000000/download--v1.png" />
                                                    <a href={file.URL} target="_blank" className="mx-1" style={{ color: 'black' }}>{file.name}
                                                        Download</a>
                                                </Button></Row>
                                            )
                                        }</Tab>
                            )
                    }
                    {
                        auth.currentUser === null || !auth
                            .currentUser
                            .email
                            .includes("@handong.ac.kr")
                            ? <Tab eventKey="links" title="links" disabled={true}></Tab>
                            : <Tab eventKey="links" title="links">
                                {
                                    links.length === 0
                                        ? <div></div>
                                        : links.map((link, index) => {
                                            if (link.name === '' && link.URL === '')
                                                return <div key={index}></div>
                                            else
                                                return <div key={index} className="">
                                                    {link.name}: <a href={link.URL} target='_blank' className="">{link.URL}</a>
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

const EditDetail = (props) => {

    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState(props.contentInfo.teamName);
    const [teamDesc, setTeamDesc] = useState(props.contentInfo.project_description);
    const [tags, setTags] = useState(props.contentInfo.hashTag);

    const [members, setMembers] = useState(props.members);
    const [files, setFiles] = useState(props.files);
    const [links, setLinks] = useState(props.links);
    const [professors, setProfessors] = useState(props.professors);

    const [countLinks, setCountLinks] = useState(props.links);
    const [OriginalLinks, setOriginalLinks] = useState(props.links);
    const linksCountBeforeChange = props.links.length;

    const handleUpdateOnClick = async () => {
        const docRef = doc(db, "CourseProjects", props.contentInfo.id);

        await updateDoc(docRef, {
            "teamName": teamName,
            "project_description": teamDesc,
            "hashTag": tags
        })
        
        // update links
        const colRef = collection(docRef, "Links");
        if(OriginalLinks !== links){
            for(let i=0; i<linksCountBeforeChange; i++){
                const linksDocRef = doc(docRef, "Links", OriginalLinks[i].uid)
                await deleteDoc(linksDocRef)
            }
            links.map(async (link) => {
                await addDoc(colRef, {
                    name: link.name,
                    URL: link.URL
                })
            });
        }
        alert('updated!');

        props.handleEditClick(false);
        navigate("/");
    }
    const handleCancelOnClick = async () => {
        props.handleEditClick(false);
    }
    
    // if bool = true: adding
    // else sub
    const inputLinks = (bool) => {
        if(bool === true){
            let countArr = [...countLinks]
            let counter = countArr.slice(-1)[0]
        
            counter += 1
            countArr.push(counter)
            setCountLinks(countArr)
            addLinksArray()
        }
        else {
            let countArr = [...countLinks]
            countArr.pop()
            if (links.length <= 1) {} else {
                setCountLinks(countArr)
                subLinksArray()
            }
        }
    }
    const addLinksArray = () => {
        const newLink = {
            id: links.length,
            name: '',
            URL: ''
        }
        setLinks(links.concat(newLink))
    }
    const subLinksArray = () => {
        let linksArr = [...links]
        linksArr.pop()
        setLinks(linksArr)
    }


    const handleLinkNameChange = (targetId, _linkName) => {
        setLinks(links.map(
            (link) => link.id === targetId
                ? {
                    ...link,
                    name: _linkName
                }
                : link
        ))
    }
    const handleLinkURLChange = (targetId, _URL) => {
        setLinks(links.map(
            (link) => link.id === targetId
                ? {
                    ...link,
                    URL: _URL
                }
                : link
        ))
    }
    return (
        <Container className=''>
            <Row>
                <Image className="col-5"
                    src={props.contentInfo.image_url}
                    fluid="fluid"
                    style={{

                    }} />
                <Form className="d-box my-3 col-7">
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
                        }} />
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
                        }} />
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
                        }} />
                </Form>
            </Row>
            <Row>
                <Container className='my-2'>
                    {
                        countLinks.map((item, index) => {
                            return (
                                <Row key={index} className="mb-2">
                                    <Form.Control
                                        key={"LinkName" + index}
                                        className='me-1'
                                        type='linkName'
                                        value={links[index].name}
                                        placeholder='Link'
                                        style={{
                                            width: '20%'
                                        }}
                                        onChange={(e) => {
                                            handleLinkNameChange(index, e.target.value)
                                        }}
                                        label='LINK NAME'/>
                                    <Form.Control
                                        key={"LinkURL" + index}
                                        className='me-1'
                                        type='linkURL'
                                        placeholder='Link URL'
                                        value={links[index].URL}
                                        style={{
                                            width: '75%'
                                        }}
                                        onChange={(e) => {
                                            handleLinkURLChange(index, e.target.value)
                                        }}
                                        label='Link URL'/>
                                </Row>

                            );
                        })
                    }
                    <Button
                        variant='outline-secondary'
                        className='me-1'
                        onClick={() => {
                            inputLinks(true)
                        }}>
                        Add Link +
                    </Button>
                    <Button
                        variant='outline-secondary'
                        onClick={() => {
                            inputLinks(false)
                        }}>
                        Del Link -
                    </Button>
                </Container>
            </Row>
            <Row>
                
            </Row>
            <Button className='mt-2 mx-1' onClick={handleUpdateOnClick}>
                Update
            </Button>
            <Button className='mt-2 mx-1' onClick={handleCancelOnClick}>
                Cancel
            </Button>
        </Container>
        
    );

}





export default DetailPage;
