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
 `
const Logo = styled.img`
    margin-bottom: 20px;
    width: 300px;
`
const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    margin-top: 30px;
`

const LoginIndex = ({ setToken }) => {
    const [login, setLogin] = useState(true);

    return (
        <StyledLogin>
            <LoginCard>
                <LoginMain>
                    <FormContainer>
                        {login ?
                            <>
                                <Logo src={logoImg} alt="website logo" />
                                <LoginForm setLogin={setLogin} setToken={setToken} />
                            </>
                            :
                            <SignUpForm setLogin={setLogin} />
                        }
                    </FormContainer>
                </LoginMain>

                <ImgContainer>
                    <img src={loginImg} alt="illustration about people interacting with social network features" />
                </ImgContainer>
            </LoginCard>
        </StyledLogin >
    )
}

export default LoginIndex
