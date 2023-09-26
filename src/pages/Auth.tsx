import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { color, commonCss, font } from "@/components/Palette";
import { AuthService } from "@/api/http/AuthService";
import { LocalStorage } from "@/utility/LocalStorage";
import { InputField } from "@/components/common/InputField";
import { useSnackbar } from "@/store/AppStore/hooks";

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
    const { pushError, pushSuccess } = useSnackbar();
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
    const onClickRegister = async () => {
        const email = loginField.email.trim();
        if (email.length === 0) return pushError("Email is empty");
        const password = loginField.password.trim();
        if (password.length === 0) return pushError("Password is empty");
        const res = await AuthService.Register(loginField.email, loginField.password);
        if (!res.success) {
            pushError(res.message)
            return;
        }
        pushSuccess("You have successfully registered, you can now log in");
    };
    return (
        <LoginWrapper>
            <LoginTitle>CHAT APP</LoginTitle>
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
                <LoginButton onClick={onClickLogin}>LOGIN</LoginButton>
                <LoginButton onClick={onClickRegister}>REGISTER</LoginButton>
            </InputFieldGroup>
        </LoginWrapper>
    )
};

export default Page;