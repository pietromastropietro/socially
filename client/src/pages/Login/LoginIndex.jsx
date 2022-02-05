import React from 'react'
import styled from 'styled-components'
import { useState } from 'react'
import loginImg from 'static/images/loginImg.png'
import logoImg from 'static/images/logo.png'
import LoginForm from './LoginForm/LoginForm'
import SignUpForm from './SignUpForm/SignUpForm'
import Button from 'components/Button/Button'

const StyledLogin = styled.div`
    display: flex;
    justify-content: center;
    background-color: #eeeeee;
`
const LoginCard = styled.div`
    background-color: #ffffff;
    display: flex;
    width: 1400px;
    // todo: remove this when adding media queries
    min-height: 530px;
    margin: 20px 100px;
    border-radius: 20px;

`
const ImgContainer = styled.figure`
    display: flex;
    width: 50%;
    background: transparent;
    margin: 0;
    
    > img {
        border-radius: 0 20px 20px 0;
        max-width: 100%;
        height: auto;
        // todo: remove this when adding media queries
        min-height: 530px;
    }
`
const LoginMain = styled.div`
    box-sizing: border-box;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;

    > div {
        width: 60%;
    }
`
const LogoContainer = styled.figure`
    margin: 30px 0 20px 0;

    > img {
        width: 300px;
    }
`
// const Button = styled.button`
//     background-color: white;
//     color: black;
//     border: 1px solid grey;
//     width: fit-content;
//     padding: 10px;
//     border-radius: 10px;
//     cursor: pointer;
// `

const LoginIndex = ({ setToken }) => {
    const [login, setLogin] = useState(true);

    return (
        <StyledLogin>
            <LoginCard>
                <LoginMain>
                    <LogoContainer>
                        <img src={logoImg} alt="website logo" />
                    </LogoContainer>

                    <div>
                        {login ?
                            <LoginForm setLogin={setLogin} setToken={setToken} />
                            :
                            <>
                                <Button primaryOutlined onClick={() => setLogin(true)}>{`< Go back`}</Button>
                                <SignUpForm setLogin={setLogin} />
                            </>
                        }
                    </div>
                </LoginMain>

                <ImgContainer>
                    <img src={loginImg} alt="illustration about people interacting with social network features" />
                </ImgContainer>
            </LoginCard>
        </StyledLogin>
    )
}

export default LoginIndex