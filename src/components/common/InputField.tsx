import { FC, KeyboardEvent, useCallback, useState } from 'react';

import { DarkTheme } from '@/theme';

import { color, commonCss, font } from '@components/Palette';

import styled from 'styled-components';

import { EyeCloseSVG, EyeOpenSVG } from './Svg';

const InputFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputFieldLabel = styled.span`
  color: ${color.kindaWhite};
  font-weight: 600;
  text-transform: uppercase;
  font-family: ${font.appleFont};
`;

const InputFieldInput = styled.input`
  outline: none;
  border: 1px solid ${DarkTheme.config.chatListNavSearchBorderColor};
  font-size: 1.2rem;
  padding: 0.7rem 0.5rem;
  border-radius: 4px;
  background-color: ${DarkTheme.config.chatListNavSearchInnerBackgroundColor};
  color: white;

  :focus-visible {
    outline: 1px solid white;
  }
`;

const ToggleShowPasswordButton = styled.button<{ $showing: boolean }>`
  ${commonCss.transition}
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: ${props =>
    props.$showing
      ? DarkTheme.config.chatListNavSearchInnerBackgroundColor
      : 'transparent'};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    height: 2rem;
    color: ${color.white};
  }

  :focus-visible {
    outline: 1px solid white;
  }
`;

type InputFieldPasswordInputProps = {
  value?: string;
  onChange?: (val: string) => void;
  onClickEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

const InputFieldPasswordInputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3rem;
  gap: 0.5ch;
`;

const InputFieldPasswordInput: FC<InputFieldPasswordInputProps> = props => {
  const [showing, setShowing] = useState(false);
  const toggleShowPassword = () => setShowing(s => !s);
  return (
    <InputFieldPasswordInputWrapper>
      <InputFieldInput
        type={!showing ? 'password' : 'text'}
        value={props.value}
        onChange={e => props.onChange?.(e.target.value)}
        onKeyDown={e => props.onClickEnter?.(e)}
      />
      <ToggleShowPasswordButton onClick={toggleShowPassword} $showing={showing}>
        {showing ? <EyeOpenSVG /> : <EyeCloseSVG />}
      </ToggleShowPasswordButton>
    </InputFieldPasswordInputWrapper>
  );
};

type InputFieldProps = {
  label: string;
  password?: boolean;
  onChange?: (val: string) => void;
  value?: string;
  onClickEnter?: () => void;
};

export const InputField: FC<InputFieldProps> = props => {
  const onKeyPressInInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        props.onClickEnter?.();
        e.preventDefault();
      }
    },
    [props]
  );
  if (props.password) {
    return (
      <InputFieldWrapper>
        <InputFieldLabel>{props.label}</InputFieldLabel>
        <InputFieldPasswordInput
          onChange={val => props.onChange?.(val)}
          onClickEnter={onKeyPressInInput}
        />
      </InputFieldWrapper>
    );
  }
  return (
    <InputFieldWrapper>
      <InputFieldLabel>{props.label}</InputFieldLabel>
      <InputFieldInput
        onChange={e => props.onChange?.(e.target.value)}
        value={props.value}
        onKeyDown={onKeyPressInInput}
      />
    </InputFieldWrapper>
  );
};
