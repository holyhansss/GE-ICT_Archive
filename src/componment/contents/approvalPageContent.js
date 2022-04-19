import  { React, useState, useEffect } from 'react';

import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs, where, query, limit, startAfter, startAt, orderBy, doc, updateDoc, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

import oc from 'open-color';
import { Card, CardHeader, CardContent, TextField, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";

const ApprovalPageContent = () => {

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
        <Card key={index} className="">
            <Link key={index}
            to={`/detailpages/${index}`}
            state={{
                id: index,
                course: doc.course,
                contentInfo: doc,
            }}
            className=""
            style={{ textDecoration: 'none' }}
            >
                <CardContent>
                    <img className="" src={doc.image_url}></img>
                </CardContent>
                <CardHeader title={doc.teamName} className=""></CardHeader>
                
                <CardContent>
                    {
                    doc.hashTag !== undefined ?
                    doc.hashTag.map((tag, index)=> 
                        <div className="" key={index}>{tag}</div>
                    )
                    : <div></div>
                    }       
                </CardContent>
            </Link>
            <div className="" onClick={(e) => {handleApproval(e, doc, index)}}>Approve</div>
        </Card>
        : <Card key={index}></Card>
    ));

    return (
        <div className="">{
            list.length !== 0
            ? list
            : <div className="">Nothing To Approved</div>
            }</div>

            //<div onClick={updatee}>update</div>
    );
}



export default ApprovalPageContent;
