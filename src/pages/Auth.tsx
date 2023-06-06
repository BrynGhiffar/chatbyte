import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SnackbarContext } from "@/components/common/Snackbar";
import { color, commonCss, font } from "@/components/Palette";
import { AuthService } from "@/service/api/AuthService";
import { LocalStorage } from "@/utility/LocalStorage";

const LoginWrapper = styled.div`
    height: 50%;
    aspect-ratio: 1 / 1;
    
    display: grid;
    grid-template-rows: 1fr 3fr;
    * {
        font-family: ${font.appleFont};
    }
    /* outline: 1px solid red; */
`;

const LoginTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    
    font-size: 3rem;
    font-weight: bold;
    letter-spacing: 0.2ch;
    color: white;
`;

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

const InputFieldGroup = styled.div`
`;

const LoginButton = styled.button`
    ${commonCss.transition}
    margin-top: 1rem;
    width: 100%;
    outline: none;
    border: none;
    font-size: 1.5rem;
    padding: 0.5rem 0px;
    font-weight: 600;
    color: ${color.lightBlue};
    background-color: ${color.darkBlue};
    cursor: pointer;
    border-radius: 4px;

    :hover {
        color: ${color.darkBlue};
        background-color: ${color.lightBlue};
    }
`;

const InputFieldPasswordInputWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 3rem;
    gap: 0.5ch;
`;

const EyeOpenSVG: FC = () => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

const EyeCloseSVG: FC = () => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 14.8335C21.3082 13.3317 22 12 22 12C22 12 18.3636 5 12 5C11.6588 5 11.3254 5.02013 11 5.05822C10.6578 5.09828 10.3244 5.15822 10 5.23552M12 9C12.3506 9 12.6872 9.06015 13 9.17071C13.8524 9.47199 14.528 10.1476 14.8293 11C14.9398 11.3128 15 11.6494 15 12M3 3L21 21M12 15C11.6494 15 11.3128 14.9398 11 14.8293C10.1476 14.528 9.47198 13.8524 9.1707 13C9.11386 12.8392 9.07034 12.6721 9.04147 12.5M4.14701 9C3.83877 9.34451 3.56234 9.68241 3.31864 10C2.45286 11.1282 2 12 2 12C2 12 5.63636 19 12 19C12.3412 19 12.6746 18.9799 13 18.9418" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

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

const InputField: FC<InputFieldProps> = (props) => {
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

interface LoginField {
    email: string;
    password: string;
}

const LoginFieldEmpty: LoginField = {
    email: "",
    password: ""

}

const Page: FC = () => {
    const [ loginField, setLoginField ] = useState(LoginFieldEmpty);
    const { push: pushError } = useContext(SnackbarContext);
    const navigate = useNavigate();
    const onClickLogin = async () => {
        const email = loginField.email.trim();
        if (email.length === 0) return pushError("Email is empty");
        const password = loginField.password.trim();
        if (password.length === 0) return pushError("Password is empty");
        const res = await  AuthService.Login(loginField.email, loginField.password);
        if (!res.success) {
            pushError(res.message)
            return;
        }
        LocalStorage.setLoginToken(res.payload);
        navigate("/");
    };
    const onClickRegister = () => {
        pushError("Registering is currently disabled");
    }
    return (
        <LoginWrapper>
            <LoginTitle>ChatApp</LoginTitle>
            <InputFieldGroup>
                <InputField 
                    label="Email *"
                    value={loginField.email}
                    onChange={val => setLoginField(f => ({ ...f, email: val }))}
                />
                <InputField 
                    label="Password *" 
                    password
                    value={loginField.password}
                    onChange={val => setLoginField(f => ({ ...f, password: val }))}
                />
                <LoginButton onClick={onClickLogin}>Log In</LoginButton>
                <LoginButton onClick={onClickRegister}>Register</LoginButton>
            </InputFieldGroup>
        </LoginWrapper>
    )
};

export default Page;