import { useState, FC } from "react";
import styled from "styled-components";
import { color, commonCss, font } from "../Palette";
import { EyeCloseSVG, EyeOpenSVG } from "./Svg";

const InputFieldWrapper = styled.div`
    /* outline: 1px solid red; */
    > * {
        display: block;
        width: 100%;
    }
    > *:first-child {
        margin-bottom: 0.5rem;
    }
    margin-bottom: 0.5rem;
`;

const InputFieldLabel = styled.span`
    color: ${color.kindaWhite};
    font-weight: 600;
    text-transform: uppercase;
    font-family: ${font.appleFont};
`;

const InputFieldInput = styled.input`
    outline: none;
    border: none;
    font-size: 1.2rem;
    padding: 0.7rem 0.5rem;
    border-radius: 4px;
    background-color: ${color.lightBlue};
    color: white;
`;


const ToggleShowPasswordButton = styled.button<{ $showing: boolean }>`
    ${commonCss.transition}
    border: none;
    outline: none;
    border-radius: 4px;
    background-color: ${props => props.$showing ? color.lightBlue : color.darkBlue};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    > * {
        height: 2rem;
        color: ${props => !props.$showing ? color.lightBlue : color.darkBlue};
    }

    :hover {
        background-color: ${color.lightBlue};
        > * {
            color: ${color.darkBlue};
        }
    }
`;


type InputFieldPasswordInputProps = {
    value?: string;
    onChange?: (val: string) => void
}


const InputFieldPasswordInputWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 3rem;
    gap: 0.5ch;
`;

const InputFieldPasswordInput: FC<InputFieldPasswordInputProps> = (props) => {
    const [showing, setShowing] = useState(false);
    const toggleShowPassword = () => setShowing(s => !s);
    return (
        <InputFieldPasswordInputWrapper>
            <InputFieldInput 
                type={!showing ? "password" : "text"} 
                value={props.value}
                onChange={
                    e => props.onChange && props.onChange(e.target.value)
                }/>
            <ToggleShowPasswordButton onClick={toggleShowPassword} $showing={showing}>
                {showing ? <EyeOpenSVG/> : <EyeCloseSVG/>}
            </ToggleShowPasswordButton>
        </InputFieldPasswordInputWrapper>
    )    
}

type InputFieldProps = {
    label: string;
    password?: boolean;
    onChange?: (val: string) => void
    value?: string;
}

export const InputField: FC<InputFieldProps> = (props) => {
    if (props.password) {
        return (
            <InputFieldWrapper>
                <InputFieldLabel>{props.label}</InputFieldLabel>            
                <InputFieldPasswordInput onChange={
                    val => props.onChange && props.onChange(val)
                }/>
            </InputFieldWrapper>
        )
    }
    return (
        <InputFieldWrapper>
            <InputFieldLabel>{props.label}</InputFieldLabel>            
            <InputFieldInput type={props.password ? "password" : "text"} onChange={
                e => props.onChange && props.onChange(e.target.value)
            }
            value={props.value}
            />
        </InputFieldWrapper>
    )
}