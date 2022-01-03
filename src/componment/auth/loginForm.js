import React from "react";
import styled from "styled-components";
import "./loginForm.css";
const LoginFormCover = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`

const LoginForm = ({ isShowLogin }) => {
    return(
        <div className={`${!isShowLogin ? "active" : ""} show`}>
            <div className="login-form">
                <div className="form-box solid">
                        <h1 className="login-text">Sign In</h1>
                        
                        {/* <label>Username</label><br></br>
                        <input
                            type="text"
                            name="username"
                            className="login-box"
                        ></input><br></br>
                        <label>Password</label><br></br>
                        <input
                            type="password"
                            name="password"
                            className="login-box"
                        ></input><br></br>
                        <input type="submit" value="LOGIN" className="login-btn"></input>
                    </form> */}
                </div>
            </div>
        </div>
    );
}

export default LoginForm;