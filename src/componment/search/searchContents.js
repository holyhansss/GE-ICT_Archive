import { React, useState } from 'react';
import { getFirestore } from "firebase/firestore";

import { useLocation } from 'react-router-dom';
import { TextField, makeStyles } from '@material-ui/core';

import styled from 'styled-components';

const useStyles = makeStyles({
    searchFormWrapper: {
        margin: '100px 100px 0px 0px'
    },
});

const StyledDiv = styled.div`
    height: 500px;
`;

const SearchContents = () => {
    const db = getFirestore();
    const { state } = useLocation();
    const [ searchKeyword, setSearchKeyword] = useState(state.searchKeyword);
    const style = useStyles();
    
    const handleSearchSubmit = (e) => {
        e.preventDefalut();
    }


    const fetchSearchData = () => {
        
    }



    return (
        <>
            <div className={style.searchFormWrapper}>
                <form
                    noValidate 
                    autoComplete='off'
                    //onSubmit={(e) => handleSearchSubmit(e)}
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
                    />  
                </form>
            </div>
            <div>
                {state.searchKeyword}
                {searchKeyword}
            </div>
        </>
    );
};

export default SearchContents;
