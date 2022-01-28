import  { React, useState, useEffect } from 'react';

import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs, where, query, limit, startAfter, startAt, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import { Card, CardHeader, CardContent, TextField, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";
import styled from 'styled-components';
import oc from 'open-color';

import { ICT_COURSES, SEMESTERS } from '../../commons/constants';

const useStyles = makeStyles({
    card: {
        margin: '10px 0px 10px 0px',
        width: '30%',
        textAlign: 'center',
        maxHeight: '30%',
        // "&:nth-child(1), &:nth-child(2), &:nth-child(3)": {
        //     margin: '10px 0px 10px 0px',
        // },
    },
    team_name: {
        color: 'black',
        margin: '0px',
    },
    // select: {
    //     margin: '100px 0px 0px 0px',
    // },
    select_course: {
        width: '13%',
    },
    select_semester: {
        width: '10%',
    },
    select_button: {
        margin: '0px 25px 0px 20px',
    },
    searchBar: {
        color: 'green',
    },
    notchedOutline: {
        borderColor: `${oc.teal[9]}`,

      }
    
});

const Positioner = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    width: 100%;
`;

const StyledForm = styled.form`
  width: 300px;
`

const SearchSelectWrapper = styled.div`
    display: flex;
    margin: 100px 50px 0px 50px;
    text-align: right;
    align-items: center;
    justify-content: space-between;
`
const SelectWrapper = styled.div`
    display: flex;
    text-align: right;
    align-items: center;
    justify-content: right;
`
const MainImage = styled.img`
    flex: 3;
    max-height: 200px;
    width: 100%;
    object-fit: contain;
`
const Tags = styled.div`
    display: inline-block;
    color: black;
    background-color: ${oc.gray[3]};
    border-radius: 30px;
    font-size: 13px;
    font-weight: bold;
    margin: 0px 2.5px 0px 2.5px;
    padding: 2px 5px 2px 5px;

`
const TeamDesc = styled.div`
    flex:2;
    display: block;
    color: black;
    padding: 0px 40px 0px 40px;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    max-height: 3.6em;
    line-height: 1.8em;

`
const Contents = ({ year }) => {
    const style = useStyles();

    const db = getFirestore();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState([]);
    const [years, setYears] = useState(year);
    const [course, setCourse] = useState('제품 기획 및 개발')
    const [selectedCourse, setSelectedCourse] = useState('제품 기획 및 개발');
    const [semester, setSemester] = useState(year);
    const [lastVisible, setLastVisible] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    // const FetchContents = async () => {
    //     //const data = await getDocs(collection(db, course), where("semester", "==", semester));
    //     const data = await getDocs(collection(db, course));
    //     setContent(data.docs.map((doc) => ({...doc.data(), id: doc.id})));        
    // };


    const getFirestContents = async () => {
        setCourse(selectedCourse)
        setContent([])

        let q = await query(collection(db, 'Course Projects'), where('course', '==', selectedCourse) ,limit(9), orderBy('image_url'))
        getDocs(q).then((snapshot) => {

            setContent((contents) => {
              const arr = [...contents]
              snapshot.forEach((doc) => {
                arr.push({...doc.data(), id: doc.id})
              })
              return arr
            })
            if (snapshot.docs.length === 0) {
                setLastVisible(-1)
            } else {
                setLastVisible(snapshot.docs[snapshot.docs.length - 1])
            }
          })
    }


    const getNextContents = () => {
        let q;
        // orderBy와 startAfter은 같아야함
        // https://dev.to/hadi/infinite-scroll-in-firebase-firestore-and-react-js-55g3
        if (lastVisible === -1) {
            return
        } else if (lastVisible) {
            q = query(collection(db, 'Course Projects'), limit(3), orderBy('image_url'), startAfter(lastVisible))
        } else {
            q = query(collection(db, 'Course Projects'), limit(9), orderBy('image_url'))
        }
        if(lastVisible !== -1){
            getDocs(q).then((snapshot) => {
                setContent((contents) => {
                  const arr = [...contents]
                  snapshot.forEach((doc) => {
                    arr.push({...doc.data(), id: doc.id})
                  })
                  return arr
                })
                if (snapshot.docs.length === 0) {
                    setLastVisible(-1)
                } else {
                    setLastVisible(snapshot.docs[snapshot.docs.length - 1])
                }
              })
        }
        
    
    }
    const getNewCourseContents = () => {
        if(selectedCourse !== course){
            setCourse(selectedCourse)
            setLastVisible(0)
            setContent([])
            getFirestContents()
        }
        
    }

    const handleSearchSubmit = () => {
        navigate(
            "/searchpage", 
            {
                state: {
                    searchKeyword: searchKeyword
            }});
    }

    useEffect(() => {
        getFirestContents();
        setLoading(false)
        
    },[])
    useEffect(() => {
    },[content])


    useBottomScrollListener(getNextContents)

    const list = content.map((doc, index) => (
        loading === false ?
        <Card key={index} className={style.card} >
            <Link key={index}
            to={`/detailpages/${index}`}
            state={{
                id: index,
                course: course,
                contentInfo: doc,

            }}
            className={style.link}
            style={{ textDecoration: 'none' }}
            >
                <CardContent>
                    <MainImage src={doc.image_url}></MainImage>
                </CardContent>
                <CardHeader title={doc.teamName} className={style.team_name}></CardHeader>
                <CardContent>
                    {
                    doc.hashTag !== undefined ?
                    doc.hashTag.map((tag, index)=> 
                    <Tags key={index}>{tag}</Tags>
                    )
                    : <div></div>
                    }       
                </CardContent>
            </Link>
        </Card>
        : <Card key={index}></Card>
    ));
    
    return (
        <div>
            <SearchSelectWrapper>
                <StyledForm
                    noValidate 
                    autoComplete='off'
                    onSubmit={handleSearchSubmit}
                >
                <TextField
                    onChange={(e) => {
                        setSearchKeyword(e.target.value)
                        // setTeamName(e.target.value)
                        // if(e.target.value !== ''){
                        // setTeamNameError(false)
                        // }
                    }}
                    InputProps={{
                        classes: {
                          notchedOutline: style.notchedOutline
                        }
                      }}
                    label='검색어를 입력하세요'
                    variant='outlined'
                    fullWidth
                    />  
                </StyledForm>

                <SelectWrapper className={style.select}>
                    <Select
                        labelId='course-lable'
                        value={selectedCourse}
                        fullWidth
                        //className={style.select_course}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value)
                        }}
                        variant='standard'
                    >
                        {ICT_COURSES.map((course, index)=> {
                        return <MenuItem key={index} value={course}>{course}</MenuItem>
                        })}
                    </Select>
                    <Button
                        variant='outlined'
                        onClick={getNewCourseContents}
                        //className={style.select_button}
                        >
                        이동
                    </Button>
                </SelectWrapper>
            </SearchSelectWrapper>
            <Positioner>
                {list}
            </Positioner>
        </div>
    );
}

export default Contents;
