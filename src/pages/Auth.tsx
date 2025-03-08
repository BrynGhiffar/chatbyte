import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthService } from '@/api/http/AuthService';
import { color, commonCss, font } from '@/components/Palette';
import { InputField } from '@/components/common/InputField';
import { useSnackbar } from '@/store/AppStore/hooks';
import { DarkTheme } from '@/theme';
import { LocalStorage } from '@/utility/LocalStorage';

import styled, { css } from 'styled-components';

const LoginWrapper = styled.div`
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
  /* letter-spacing: 0.2ch; */
  color: white;
  > * {
    padding-right: 1rem;
    height: 3rem;
  }
`;

const InputFieldGroup = styled.div``;

interface AuthButtonProps {
  $type?: 'login' | 'register';
}

const AuthButton = styled.button<AuthButtonProps>`
  ${commonCss.transition}
  width: 100%;
  outline: none;
  ${props =>
    props.$type == 'login'
      ? 'border: 1px solid transparent;'
      : `border: 1px solid ${DarkTheme.config.chatInputBorderColor};`}
  font-size: 1rem;
  padding: 0.5rem 0px;
  font-weight: 600;
  color: ${color.white};
  background-color: ${props =>
    props.$type == 'login'
      ? DarkTheme.config.chatBubbleBackgroundColorUserSent
      : DarkTheme.config.chatListNavSearchInnerBackgroundColor};
  cursor: pointer;
  border-radius: 4px;

  :focus-visible {
    outline: 1px solid white;
  }
  ${commonCss.transition}

  ${props => {
    if (props.$type == 'login') {
      return css`
        :hover {
          box-shadow: 0px 0px 10px 2px
            ${DarkTheme.config.chatBubbleBackgroundColorUserSent};
        }
      `;
    } else {
      return null;
    }
  }}
`;

interface LoginField {
  email: string;
  password: string;
}

const LoginFieldEmpty: LoginField = {
  email: '',
  password: '',
};

const SC__Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 10px 0px;
`;

const SC__ByteSpan = styled.span`
  padding: 0px;
  margin: 0px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${color.chatBlue};
`;

const Page: FC = () => {
  const [loginField, setLoginField] = useState(LoginFieldEmpty);
  const { pushError, pushSuccess } = useSnackbar();
  const navigate = useNavigate();
  const onClickLogin = async () => {
    const email = loginField.email.trim();
    if (email.length === 0) return pushError('Email is empty');
    const password = loginField.password.trim();
    if (password.length === 0) return pushError('Password is empty');
    const res = await AuthService.Login(loginField.email, loginField.password);
    if (!res.success) {
      pushError(res.message);
      return;
    }
    LocalStorage.setLoginToken(res.payload);
    navigate('/');
  };
  const onClickRegister = async () => {
    const email = loginField.email.trim();
    if (email.length === 0) return pushError('Email is empty');
    const password = loginField.password.trim();
    if (password.length === 0) return pushError('Password is empty');
    const res = await AuthService.Register(
      loginField.email,
      loginField.password
    );
    if (!res.success) {
      pushError(res.message);
      return;
    }
    pushSuccess('You have successfully registered, you can now log in');
  };
  return (
    <LoginWrapper>
      <LoginTitle>
        <img src='/logo.svg' alt='' />
        chat<SC__ByteSpan>byte</SC__ByteSpan>
      </LoginTitle>
      <SC__Form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <InputField
          label='Email *'
          placeholder='email'
          value={loginField.email}
          onChange={val => setLoginField(f => ({ ...f, email: val }))}
          onClickEnter={onClickLogin}
        />
        <InputField
          label='Password *'
          placeholder='password'
          password
          value={loginField.password}
          onChange={val => setLoginField(f => ({ ...f, password: val }))}
          onClickEnter={onClickLogin}
        />
        <AuthButton onClick={onClickLogin} $type='login'>
          Log in
        </AuthButton>
        <AuthButton onClick={onClickRegister}>Register</AuthButton>
      </SC__Form>
    </LoginWrapper>
  );
};

export default Page;
