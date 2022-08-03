import { React, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactTagInput from '@pathofdev/react-tag-input';

import { getFirestore, collection, getDocs, doc, updateDoc, query, addDoc, deleteDoc, } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Container, Form, Image, Tab, Tabs, Button, Row } from 'react-bootstrap';
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL} from 'firebase/storage';

import { COLLECTION_NAMES } from '../../commons/constants';
import { Unix_timestampConv } from '../../commons/Utils';


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
                collection(db, `${COLLECTION_NAMES['mainCollection']}`, contentInfo.id, "members")
            );
            setMembers(memberData.docs.map((doc, index) => ({
                ...doc.data(),
                id: index,
                uid: doc.id
            })));
            const fileData = await getDocs(
                collection(db, `${COLLECTION_NAMES['mainCollection']}`, contentInfo.id, "fileURLs")
            );
            setFiles(fileData.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })));
            const linksData = await getDocs(
                collection(db, `${COLLECTION_NAMES['mainCollection']}`, contentInfo.id, "Links")
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
                                                    <a download href={file.URL} target="_blank" className="mx-1" style={{ color: 'black' }}>{file.name} Download</a>
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
    const storage = getStorage();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState(props.contentInfo.teamName);
    const [teamDesc, setTeamDesc] = useState(props.contentInfo.project_description);
    const [tags, setTags] = useState(props.contentInfo.hashTag);

    const [members, setMembers] = useState(props.members);
    const [newFiles, setNewFiles] = useState([{
        id: 0,
        name: '',
        content: null,
        URL: '',
        storage: '',
    }]);
    const [oldFiles, setOldFiles] = useState(props.files);
    
    const [links, setLinks] = useState(props.links);
    const [professors, setProfessors] = useState(props.professors);

    const [countMembers, setCountMembers] = useState(props.members);
    const [countLinks, setCountLinks] = useState(props.links);
    const [countOldFiles, setCountOldFiles] = useState(props.files);
    const [countNewFiles, setCountNewFiles] = useState([0]);

    const [originalMembers, setOriginalMembers] = useState(props.members);
    const [originalLinks, setOriginalLinks] = useState(props.links);
    
    const linksCountBeforeChange = props.links.length;
    const membersCountBeforeChange = props.members.length;


    useEffect(()=> {

    }, [oldFiles]);

    const handleUpdateOnClick = async () => {
        if(!professors.includes(auth.currentUser.email) && !props.contentInfo.owner === auth.currentUser.email){
            alert("only authorized user can update states");
            return 0;
        }

        const docRef = doc(db, "CourseProjects", props.contentInfo.id);

        await updateDoc(docRef, {
            "teamName": teamName,
            "project_description": teamDesc,
            "hashTag": tags
        })
        
        // update links
        const linkColRef = collection(docRef, COLLECTION_NAMES['links']);
        if(originalLinks !== links){
            for(let i=0; i<linksCountBeforeChange; i++){
                const linksDocRef = doc(docRef, "Links", originalLinks[i].uid)
                await deleteDoc(linksDocRef)
            }
            links.map(async (link) => {
                await addDoc(linkColRef, {
                    name: link.name,
                    URL: link.URL
                })
            });
        }

        // update members
        const memberColRef = collection(docRef, COLLECTION_NAMES['members']);
        if(originalMembers !== members){
            for(let i=0; i<membersCountBeforeChange; i++){
                const membersDocRef = doc(docRef, "members", originalMembers[i].uid)
                await deleteDoc(membersDocRef)
            }
            members.map(async (member) => {
                await addDoc(memberColRef, {
                    name: member.name,
                    classOf: member.classOf
                })
            });
        }

        // update files
        const timestamp = Unix_timestampConv();
        const fileColRef = collection(docRef, COLLECTION_NAMES['fileURLs'])

        newFiles.map(async (file, index) => {
            let uploadFileName = `files/${file.name}_${index}_${timestamp}`;
            
            let fileStorageRef = ref(storage, uploadFileName);

            await uploadBytes(fileStorageRef, file.content);
            // let DownloadURL = 
            await getDownloadURL(fileStorageRef).then(async (DownloadURL) => {
                await addDoc(fileColRef, {
                    name: file.name,
                    URL: DownloadURL,
                    storage: `${file.name}_${index}_${timestamp}`
                });
            });
        });

        alert('updated!');

        props.handleEditClick(false);
        navigate("/");
    }
    const handleCancelOnClick = async () => {
        props.handleEditClick(false);
    }
    const handleDeleteFile = async (file) => {
        console.log(file)

        // Create a reference to the file to delete
        const fileRef = ref(storage, `files/${file.storage}`);

        // Delete the file
        await deleteObject(fileRef).then(() => {
        // File deleted successfully
            setOldFiles(oldFiles.filter(oldFile => oldFile !== file));
            console.log("successfully Deleted");
        }).catch((error) => {
            // error
            console.log(error);
        });

        const deletedFileRef = doc(db, `${COLLECTION_NAMES['mainCollection']}/${props.contentInfo.id}/${COLLECTION_NAMES['fileURLs']}/${file.id}`);
        await deleteDoc(deletedFileRef);

    }
    // if bool = true: adding
    // else sub
    const inputLinks = (bool) => {
        let countArr = [...countLinks]

        if(bool === true){
            let counter = countArr.slice(-1)[0]
            counter += 1
            countArr.push(counter)
            setCountLinks(countArr)
            addLinksArray()
        }
        else {
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
    const inputMembers = (bool) => {
        let countArr = [...countMembers]
        if(bool === true){
            let counter = countArr.slice(-1)[0]
            counter += 1
            countArr.push(counter)
            setCountMembers(countArr)
            addMembersArray()
        }
        else {
            countArr.pop()
            if (members.length <= 1) {} else {
                setCountMembers(countArr)
                subMembersArray()
            }
        }
    }
    const addMembersArray = () => {
        const newMember = {
            id: members.length,
            name: '',
            classOf: ''
        }
        setMembers(members.concat(newMember))
    }
    const subMembersArray = () => {
        let membersArr = [...members]
        membersArr.pop()
        setMembers(membersArr)
    }
    const inputFiles = (bool) => {
        let countArr = [...countNewFiles]
        if(bool === true){
            let counter = countArr.slice(-1)[0]
            counter += 1
            countArr.push(counter)
            setCountNewFiles(countArr)
            addFilesArray()
        }
        else {
            countArr.pop()
            if (newFiles.length <= 1) {} else {
                setCountNewFiles(countArr)
                subFilesArray()
            }
        }
    }
    const addFilesArray = () => {
        const newFile = {
            id: newFiles.length,
            name: '',
        }
        setNewFiles(newFiles.concat(newFile))
    }
    const subFilesArray = () => {
        let filesArr = [...newFiles]
        filesArr.pop();
        setNewFiles(filesArr);
    }


    const handleLinkChange = (targetId, content, contentId) => {
        if(contentId === 0){
            setLinks(links.map((link) => 
                link.id === targetId
                    ? {...link, name: content}
                    : link
            ));
        } else if(contentId === 1){
            setLinks(links.map((link) => 
                link.id === targetId
                    ? {...link, URL: content}
                    : link
            ));
        }
    }
    const handleMemberChange = (targetId, content, contentId) => {
        if(contentId === 0){
            setMembers(members.map((member) => 
                member.id === targetId
                    ? {...member, name: content}
                    : member
            ));
        } else if(contentId === 1){
            setMembers(members.map((member) => 
                member.id === targetId
                    ? {...member, classOf: content}
                    : member
            ));
        }
        console.log(members);   
    }
    const handleFilesChange = (targetId, content, contentId) => {
        if(contentId === 0){
            setNewFiles(newFiles.map((file) => 
                file.id === targetId
                    ? {...file, name: content}
                    : file
            ));
        } else if(contentId === 1){
            setNewFiles(newFiles.map((file_) => 
                file_.id === targetId
                    ? {...file_, content: content}
                    : file_
            ));
        }
        console.log(newFiles)
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
            <Container>
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
                                                handleLinkChange(index, e.target.value, 0)
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
                                                handleLinkChange(index, e.target.value, 1)
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
                
            </Container>
            <Container>
                <Row>
                    <Container className='my-2 col-6'>
                        {
                            countMembers.map((item, index) => {
                                return (
                                    <Row key={index} className="mb-2">
                                        <Form.Control
                                            className='me-1'
                                            type=''
                                            value={members[index].classOf}
                                            placeholder='학번'
                                            style={{
                                                width: '20%'
                                            }}
                                            onChange={(e) => {
                                                handleMemberChange(index, e.target.value, 1)
                                            }}
                                            label='member class'/>
                                        <Form.Control
                                            className='me-1'
                                            type=''
                                            placeholder='팀원 이름'
                                            value={members[index].name}
                                            style={{
                                                width: '70%'
                                            }}
                                            onChange={(e) => {
                                                handleMemberChange(index, e.target.value, 0)
                                            }}
                                            label='팀원 이름'/>
                                    </Row>
                                );
                            })
                        }
                        <Button
                            variant='outline-secondary'
                            className='me-1'
                            onClick={() => {
                                inputMembers(true)
                            }}>
                            Add Mem +
                        </Button>
                        <Button
                            variant='outline-secondary'
                            onClick={() => {
                                inputMembers(false)
                            }}>
                            Del Mem -
                        </Button>
                    </Container>
                    <Container className='my-2 col-6'>
                        {countOldFiles.map((item, index) => {
                            return(
                                <Row key={index} className="mb-2">
                                    <Row key={index} md='auto' className='my-2' style={{ width: '50%' }}>
                                        <Button className="" variant='light'>
                                        <img src="https://img.icons8.com/material-sharp/18/000000/download--v1.png" />
                                        <a download href={oldFiles[index].URL} target="_blank" className="mx-3" style={{ color: 'black' }}>{oldFiles[index].name}</a>
                                        </Button>
                                        <Button variant='danger' 
                                            onClick={() => {
                                                //console.log(item)
                                                handleDeleteFile(item)}
                                            }>파일 삭제</Button>
                                    </Row>                                                  
                                </Row>
                                );  
                            })
                        }
                        <Container>
                    {
                        countNewFiles.map((item, index) => {
                            return (
                                <Row key={index} className="mb-2">
                                    <Form.Control
                                        key={"FileName" + index}
                                        name='File Name'
                                        className='me-1'
                                        placeholder='File name'
                                        value={newFiles[index].name}
                                        style={{
                                            width: '25%'
                                        }}
                                        onChange={(e) => {
                                            handleFilesChange(index, e.target.value, 0);
                                        }}
                                        label='File Name'/>

                                    <Form.Control
                                        type="file"
                                        className='me-1'
                                        value={newFiles[index].file}
                                        style={{
                                            width: '70%'
                                        }}
                                        onChange={(e) => {
                                            handleFilesChange(index, e.target.files[0], 1);
                                            console.log(e.target.files[0])
                                        }}/>

                                </Row>

                            );
                        })
                    }

                    <Button
                        variant='outline-secondary'
                        className='me-1'
                        onClick={() => {
                            inputFiles(true);
                        }}>
                        +
                    </Button>
                    <Button
                        variant='outline-secondary'
                        onClick={() => {
                            inputFiles(false);
                        }}>
                        -
                    </Button>
                </Container>

                    </Container>
                </Row>
            </Container>
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
