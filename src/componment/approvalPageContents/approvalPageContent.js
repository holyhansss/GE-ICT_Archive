import  { React, useState, useEffect } from 'react';

import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs, where, query, limit, startAfter, startAt, orderBy, doc, updateDoc, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import oc from 'open-color';
import { Card, CardHeader, CardContent, TextField, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";
const useStyles = makeStyles({
    positioner:{
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        width: '100%',
    },
    card: {
        margin: '10px 0px 10px 0px',
        width: '30%',
        textAlign: 'center',
        maxHeight: '30%',
        "&:nth-child(1), &:nth-child(2), &:nth-child(3)": {
            margin: '100px 0px 10px 0px',
        },
    },
    mainImage: {
        flex: '3',
        maxHeight: '200px',
        width: '100%',
        objectFit: 'contain',
    },
    team_name: {
        color: 'black',
        margin: '0px',
    },
    tags: {
        display: 'inline-block',
        color: 'black',
        backgroundColor: `${oc.gray[3]}`,
        borderRadius: '30px',
        fontSize: '13px',
        fontWeight: 'bold',
        margin: '0px 2.5px 0px 2.5px',
        padding: '2px 5px 2px 5px',
    },
    approveButton: {
        display: 'inline-block',
        color: 'black',
        backgroundColor: `${oc.gray[3]}`,
        borderRadius: '30px',
        fontSize: '15px',
        fontWeight: 'bold',
        margin: '0px 2.5px 10px 2.5px',
        padding: '2px 5px 2px 5px',
    },
    NothingToApprove: {
        display: 'inline-block',
        color: 'black',
        fontSize: '40px',
        fontWeight: 'bold',
        margin: '100px 2.5px 10px 2.5px',
    }
    
});
const ApprovalPageContent = () => {
    const style = useStyles();

    const db = getFirestore();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const fetchContent = async () => {
            let q = await query(collection(db, 'CourseProjects'), where('approved', '==', false), orderBy('createdAt', 'desc'))
            getDocs(q).then((snapshot) => {
                setContent((contents) => {
                    const arr = [...contents]
                    snapshot.forEach((doc) => {
                        arr.push({...doc.data(), id: doc.id})
                    })
                    return arr;
                })
                
            })
            setLoading(false)
        }
        fetchContent();        
    },[])

    useEffect(()=> {
    },[content])

    const updatee = async () => {
        let q = await query(collection(db, 'CourseProjects'))
        getDocs(q).then(async (snapshot) => {
            snapshot.forEach(async (doc)=> {
                console.log(doc.data())
                await addDoc(collection(db, "CourseProjects"), doc.data());
                
            })
            //await addDoc(collection(db, "CourseProjects"), snapshot.data());
        })

    }

    const handleApproval = async (e, document, index) => {
        await updateDoc(doc(db, "CourseProjects", document.id),{
            "approved": true,
        }).then((e) => {
            alert("approved!")
            var filtered = content.filter(function(value, index, arr){ 
                return document !== value;
            });
            setContent(filtered)
            //console.log(filtered)

        });
    }

    const list = content.map((doc, index) => (
        loading === false ?
        <Card key={index} className={style.card} >
            <Link key={index}
            to={`/detailpages/${index}`}
            state={{
                id: index,
                course: doc.course,
                contentInfo: doc,
            }}
            className={style.link}
            style={{ textDecoration: 'none' }}
            >
                <CardContent>
                    <img className={style.mainImage} src={doc.image_url}></img>
                </CardContent>
                <CardHeader title={doc.teamName} className={style.team_name}></CardHeader>
                
                <CardContent>
                    {
                    doc.hashTag !== undefined ?
                    doc.hashTag.map((tag, index)=> 
                        <div className={style.tags}key={index}>{tag}</div>
                    )
                    : <div></div>
                    }       
                </CardContent>
            </Link>
            <div className={style.approveButton} onClick={(e) => {handleApproval(e, doc, index)}}>Approve</div>
        </Card>
        : <Card key={index}></Card>
    ));

    return (
        <div className={style.positioner}>{
            list.length !== 0
            ? list
            : <div className={style.NothingToApprove}>Everything Was Approve</div>
            }</div>

            //<div onClick={updatee}>update</div>
    );
}



export default ApprovalPageContent;
