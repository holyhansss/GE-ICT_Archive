import {React, useState, useEffect} from 'react';

import {Firestore} from 'firebase/firestore';
import {getFirestore, collection, addDoc} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import ReactTagInput from "@pathofdev/react-tag-input";
import {useNavigate} from 'react-router-dom';

import "@pathofdev/react-tag-input/build/index.css";
import {Form, Button, Container, Row} from "react-bootstrap";

import {ICT_COURSES, SEMESTERS} from '../../commons/constants';

function ProposalForm() {

    const navigate = useNavigate();

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
            major: ''
        }
    ]);
    const [links, setLinks] = useState([
        {
            id: 0,
            name: '',
            URL: ''
        }
    ]);
    const [selectedFiles, setSelectedFiles] = useState([
        {
            id: 0,
            fileName: '',
            file: ''
        }
    ]);

    const [teamDesc, setTeamDesc] = useState('');
    const [course, setCourse] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [tags, setTags] = useState(["example tag"]);
    const [fileURLs, setFileURLs] = useState([{}]);
    const [lock, setLock] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(lock == true) return;
        else setLock(true);
        alert('1-2초 가량 기다려 주세요!');
        
        if (teamName && teamDesc && course && selectedSemester && selectedImage) {
            //console.log(teamName, teamDesc, selectedSemester, teamMembers, course)
            const db = getFirestore();
            const storage = getStorage();
            const auth = getAuth();
            const fileURLssss = [];
            
            const currentTime = Unix_timestampConv();
            //console.log(currentTime); upload main image
            let imageStorageRef = ref(
                storage,
                `images/${selectedImage.name}${currentTime}`
            )
            await uploadBytes(imageStorageRef, selectedImage)
            const imageStorageURL = await getDownloadURL(imageStorageRef)
            //console.log(imageStorageURL); upload files
            for (let i = 0; i < selectedFiles.length; i++) {
                if (selectedFiles[i].file !== '' && selectedFiles[i].file !== undefined) {
                    //console.log(selectedFiles[i])
                    let filename = selectedFiles[i].fileName;
                    let storageRef = ref(storage, `${selectedFiles[i].fileName}${currentTime}`);
                    await uploadBytes(storageRef, selectedFiles[i].file)
                    let URL = await getDownloadURL(storageRef)
                    let newFile = {
                        name: filename,
                        URL: URL
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
                createdAt: currentTime
            });

            // member 저장
            if (course !== 'IDEA CENTER') {
                console.log("this work but ?")
                const memberCollectionRef = collection(docRef, 'members')
                teamMembers.map((memberInfo, index) => {
                    if (memberInfo.name !== '' && memberInfo.classOf !== '') {
                        addDoc(memberCollectionRef, {
                            name: memberInfo.name,
                            // email: memberInfo.email,
                            classOf: memberInfo.classOf,
                            // major: memberInfo.major
                        })
                    }
                })
            }

            //FILES URL 링크들 저장
            const fileCollectionRef = collection(docRef, 'fileURLs')
            fileURLssss.map((fileURL, index) => addDoc(fileCollectionRef, {
                name: fileURL.name,
                URL: fileURL.URL
            }))
            // Link들 저장
            const LinksCollectionRef = collection(docRef, 'Links')
            links.map((link) => {
                addDoc(LinksCollectionRef, {
                    name: link.name,
                    URL: link.URL
                })
            })
            setLock(false);
            alert('upload success');
            // window.location.reload();
            navigate("/");
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
            major: ''
        }
        setTeamMembers(teamMembers.concat(newMember))
    }

    const subInputMember = () => {
        let countArr = [...countMember]
        countArr.pop()
        if (teamMembers.length <= 1) {} else {
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
            URL: ''
        }
        setLinks(links.concat(newLink))
        //console.log(links)
    }

    const subInputLinks = () => {
        let countArr = [...countLinks]
        countArr.pop()
        if (links.length <= 1) {} else {
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
            file: ''
        }
        setSelectedFiles(selectedFiles.concat(newLFile))
        //console.log(selectedFiles)
    }

    const subInputFiles = () => {
        let countArr = [...countFiles]
        countArr.pop()
        if (selectedFiles.length <= 1) {} else {
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
        setTeamMembers(teamMembers.map(
            (member) => member.id === targetId
                ? {
                    ...member,
                    name: _name
                }
                : member
        ))
    }
    const handleMemberClassOfChange = (targetId, _classOf) => {
        setTeamMembers(teamMembers.map(
            (member) => member.id === targetId
                ? {
                    ...member,
                    classOf: _classOf
                }
                : member
        ))
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
    const handleFileNameChange = (targetId, _fileName) => {
        setSelectedFiles(selectedFiles.map(
            (file) => file.id === targetId
                ? {
                    ...file,
                    fileName: _fileName
                }
                : file
        ))
    }
    const handleFileChange = (targetId, _file) => {
        setSelectedFiles(selectedFiles.map(
            (selectedFile) => selectedFile.id === targetId
                ? {
                    ...selectedFile,
                    file: _file
                }
                : selectedFile
        ))
    }

    function Unix_timestampConv() {
        return Math.floor(new Date().getTime() / 1000);
    }

    useEffect(() => {
        //console.log(selectedFiles)
    }, [selectedFiles])

    useEffect(() => {}, [countMember, countLinks])

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
        //console.log(imageUrl)
    }, [selectedImage]);

    return (
        <Container className='my-5'>

            <input
                accept='image/*'
                type='file'
                id='select-image'
                className='d-none'
                onChange={e => setSelectedImage(e.target.files[0])}/>
            <Button variant='primary'>
                <label htmlFor='select-image'>
                    Upload Main Image *
                </label>
            </Button>
            {
                imageUrl && selectedImage && (
                    <div className='my-2'>
                        {/* <div>Image Preview:</div> */}
                        <img src={imageUrl} alt={selectedImage.name} height='300px'/>
                    </div>
                )
            }

            <Form className="d-box my-3" onSubmit={handleSubmit}>
                <Form.Control
                    className='my-2'
                    type='title'
                    placeholder='Title *'
                    required
                    onChange={(e) => {
                        setTeamName(e.target.value);
                    }}
                    style={{
                        width: '30%',
                        height: '50px'
                    }}/>
                <Form.Select
                    className='d-inline w-25 mb-2'
                    onChange={(e) => {
                        setCourse(e.target.value);
                    }}
                    required
                    style={{
                        marginRight: "5px"
                    }}>
                    <option value=''>Course *</option>
                    {
                        ICT_COURSES.map((course, index) => {
                            return <option key={index} value={course}>{course}</option>
                        })
                    }
                </Form.Select>
                <Form.Select
                    className='d-inline w-25'
                    required
                    onChange={(e) => {
                        setSelectedSemester(e.target.value)
                    }}
                    style={{
                        marginRight: "5px"
                    }}>
                    <option value=''>수강학기 *</option>
                    {
                        SEMESTERS.map((semester, index) => {
                            return <option key={index} value={semester}>{semester}</option>
                        })
                    }
                </Form.Select>
                <Container className='my-2'>
                    {
                        course !== 'IDEA CENTER'
                            ? countMember.map((item, index) => {
                                return (
                                    <Row key={item} className="mb-2">
                                        <Form.Control
                                            className='me-1'
                                            type='name'
                                            placeholder='Name *'
                                            onChange={(e) => {
                                                handleMemberNameChange(index, e.target.value)
                                                // if (e.target.value !== '') {     setTeamMemberNameError(false) }
                                            }}
                                            style={{
                                                width: '15%'
                                            }}></Form.Control>
                                        <Form.Control
                                            type='name'
                                            placeholder='학번 ex) 19, 22 *'
                                            onChange={(e) => {
                                                handleMemberClassOfChange(index, e.target.value)
                                                //   if (e.target.value !== '') {     setTeamMemberClassOfError(false) }
                                            }}
                                            style={{
                                                width: '15%'
                                            }}></Form.Control>
                                    </Row>

                                );
                            })
                            : <div></div>
                    }
                    {
                        course !== 'IDEA CENTER'
                            ? <div>
                                    <Button
                                        variant='outline-secondary'
                                        className='me-1'
                                        onClick={() => {
                                            addInputMember()
                                        }}>
                                        +
                                    </Button>
                                    <Button
                                        variant='outline-secondary'
                                        onClick={() => {
                                            subInputMember()
                                        }}>
                                        -
                                    </Button>
                                </div>
                            : <div></div>
                    }
                </Container>
                <div className='w-50 my-2'>
                    <ReactTagInput
                        tags={tags}
                        maxTags={15}
                        removeOnBackspace={true}
                        placeholder="HashTag: 단어 치고 Enter!"
                        onChange={(newTags) => {
                            if (newTags.length > 0) {
                                newTags[newTags.length - 1] = newTags[newTags.length - 1].trim()
                            }
                            setTags(newTags)
                        }}/>
                </div>
                <Form.Control
                    type=''
                    as='textarea'
                    placeholder='Project Description *'
                    required
                    onChange={(e) => {
                        setTeamDesc(e.target.value)
                      }}
                    style={{
                        width: '50%',
                        height: '150px'
                    }}/>
                <Container className='my-2'>
                    {
                        countLinks.map((item, index) => {
                            return (
                                <Row key={item} className="mb-2">
                                    <Form.Control
                                        key={"LinkName" + index}
                                        className='me-1'
                                        type='linkName'
                                        placeholder='Link'
                                        style={{
                                            width: '15%'
                                        }}
                                        onChange={(e) => {
                                            handleLinkNameChange(index, e.target.value)
                                            // if(e.target.value !== ''){   setTeamMemberNameError(false) }
                                        }}
                                        label='LINK NAME'/>
                                    <Form.Control
                                        key={"LinkURL" + index}
                                        className='me-1'
                                        type='linkURL'
                                        placeholder='Link URL'
                                        style={{
                                            width: '45%'
                                        }}
                                        onChange={(e) => {
                                            handleLinkURLChange(index, e.target.value)
                                            // if(e.target.value !== ''){   setTeamMemberEmailError(false) }
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
                            addInputLinks()
                        }}>
                        +
                    </Button>
                    <Button
                        variant='outline-secondary'
                        onClick={() => {
                            subInputLinks()
                        }}>
                        -
                    </Button>
                </Container>
                <Container>
                    {
                        countFiles.map((item, index) => {
                            return (
                                <Row key={index} className="mb-2">
                                    <Form.Control
                                        key={"FileName" + index}
                                        name='File Name'
                                        className='me-1'
                                        placeholder='File name'
                                        style={{
                                            width: '15%'
                                        }}
                                        onChange={(e) => {
                                            //handleLinkNameChange(index, e.target.value)
                                            handleFileNameChange(index, e.target.value)
                                        }}
                                        label='File Name'/>

                                    <Form.Control
                                        type="file"
                                        className='me-1'
                                        style={{
                                            width: '25%'
                                        }}
                                        onChange={(e) => {
                                            handleFileChange(index, e.target.files[0])
                                        }}/>

                                </Row>

                            );
                        })
                    }

                    <Button
                        variant='outline-secondary'
                        className='me-1'
                        onClick={() => {
                            addInputFiles()
                        }}>
                        +
                    </Button>
                    <Button
                        variant='outline-secondary'
                        onClick={() => {
                            subInputFiles()
                        }}>
                        -
                    </Button>
                </Container>
                <Button
                    type='submit'
                    variant='primary'
                    style={{
                        margin: '10px 10px 10px 10px'
                    }}>
                    Submit
                </Button>
            </Form>

        </Container>

    );
}

export default ProposalForm;
