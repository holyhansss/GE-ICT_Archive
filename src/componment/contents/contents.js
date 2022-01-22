import  { React, useState, useEffect, Children } from 'react';
import styled from 'styled-components';
import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardActions, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";
import {  } from '@material-ui/core/IconButton';
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
    select: {
        margin: '100px 0px 0px 0px',
    },
    select_course: {
        width: '13%',
    },
    select_semester: {
        width: '10%',
    },
    select_button: {
        margin: '0px 25px 0px 20px',
    }
});

const Positioner = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;
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
    //const course = "제품 기획 및 개발"
    const [content, setContent] = useState([]);
    const [years, setYears] = useState(year);
    const [course, setCourse] = useState('제품 기획 및 개발')
    const [semester, setSemester] = useState(year);

    const FetchContents = async () => {
        const data = await getDocs(collection(db, course), where("semester", "==", semester));
        setContent(data.docs.map((doc) => ({...doc.data(), id: doc.id})));        
    };

    useEffect(() => {
        
        FetchContents();
        setLoading(false)
        console.log('heheh')
    },[])

    useEffect(() => {

    },[content])
    const list = content.map((doc, index) => (
        loading == false ?
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
                    doc.hashTag != undefined ?
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
            <SelectWrapper className={style.select}>
                <Select
                    labelId='course-lable'
                    value={course}
                    fullWidth
                    className={style.select_course}
                    onChange={(e) => {
                    setCourse(e.target.value)

                    }}
                    variant='standard'
                >
                    {ICT_COURSES.map((course, index)=> {
                    return <MenuItem key={index} value={course}>{course}</MenuItem>
                    })}
                </Select>
                <Select
                    labelId='semester-lable'
                    value={semester}
                    fullWidth
                    className={style.select_semester}
                    onChange={(e) => {
                    setSemester(e.target.value)
                    }}
                    variant='standard'

                >
                    {SEMESTERS.map((semester, index)=> {
                    return <MenuItem key={index} value={semester}>{semester}</MenuItem>
                    })}
                </Select>
                <Button
                    variant='outlined'
                    onClick={FetchContents}
                    className={style.select_button}>
                    이동
                </Button>
            </SelectWrapper>
            <Positioner>
                {list}
            </Positioner>
        </div>
    );
}

export default Contents;
