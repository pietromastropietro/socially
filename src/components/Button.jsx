import React from 'react'
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: #23b7f1;
    color: white;
    width: 70px;
    height: 30px;
    border: none;
    padding: 5px;
    border-radius: 10px;
`;

const Button = ({ text }) => {
    return (
        <StyledButton>
            {text}
        </StyledButton>
    )
};
export default Button