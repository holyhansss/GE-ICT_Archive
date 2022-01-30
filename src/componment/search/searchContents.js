import { React, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, limit, orderBy  } from "firebase/firestore";


import { useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, TextField, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";

import oc from 'open-color';


const useStyles = makeStyles({
    searchFormWrapper: {
        margin: '100px 0px 0px 0px',
        textAlign: 'center',
    },
    searchBar: {
        width: '30%'
    },
    mainImage: {
        flex: '3',
        maxHeight: '200px',
        width: '100%',
        objectFit: 'contain',
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
    cardPositioner: {
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
    notchedOutline:{
        borderColor: `${oc.teal[9]}`,
    }

});



const SearchContents = () => {
    const db = getFirestore();
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState(state.searchKeyword);
    const [content, setContent] = useState([]);
    const [lastVisible, setLastVisible] = useState(0);

    const style = useStyles();
    
    const handleSearchSubmit = (e) => {

        e.preventDefault()
        if(searchKeyword !== ''  && searchKeyword !== undefined && searchKeyword !== null){
            setLastVisible(0)
            setContent([])
            getFirestContents()
        }

    }


    const getFirestContents = async () => {
        if(searchKeyword !== ''  && searchKeyword !== undefined && searchKeyword !== null && content.length === 0){
            let q = await query(collection(db, 'Course Projects'), where('hashTag', 'array-contains', searchKeyword) ,limit(9))
            getDocs(q).then((snapshot) => {
                console.log(snapshot.docs.length);
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

    useEffect(()=> {
        getFirestContents()
        setLoading(false)
    },[])
    useEffect(()=> {
        
    })
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
                    <div className={style.tags} key={index}>{tag}</div>
                    )
                    : <div></div>
                    }       
                </CardContent>
            </Link>
        </Card>
        : <Card key={index}></Card>
    ));

    return (
        <>
            <div className={style.searchFormWrapper}>
                <form
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
                    value={searchKeyword}
                    className={style.searchBar}
                    />  
                </form>
            </div>
            <div className={style.cardPositioner}>
                {list}
            </div>

        </>
    );
};

export default SearchContents;
