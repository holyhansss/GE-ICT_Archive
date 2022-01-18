import {React, useState, useEffect} from 'react';
import { Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, makeStyles } from '@material-ui/core';
import styled from 'styled-components';
 
const useStyles = makeStyles({
    margin: {
      margin: '10px 0px 10px 0px',
      width: '45%',
    },
});

const WrapNameAndEmail = styled.div`


`
const InputMember = (props) => {

const style = useStyles();
return (
    <div>
        {props.countMember.map((item, index)=> {
        return (
        <WrapNameAndEmail>
        <TextField
            key={index}
            onChange={(e) => {
                // setTeamMember(e.target.value)
                if(e.target.value !== ''){
                //   setTeamMemberError(false)
                }
            }}
            label='Team Member'
            variant='outlined'
            color="primary"
            fullWidth
            required
        //   error={teamMemberError}
          className={style.margin}
        />
        <TextField
            key={index}
            onChange={(e) => {
                
            }}
            label='Email'
            variant='outlined'
            color="primary"
            fullWidth
            required
        //   error={teamMemberError}
          className={style.margin}
        />
        </WrapNameAndEmail>

        );
        })}
    </div>
     );
}

export default InputMember;