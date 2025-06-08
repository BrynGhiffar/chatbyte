import { FC, PropsWithChildren } from 'react';
import Select, { ValueContainerProps, components } from 'react-select';

import { commonCss } from '@/components/Palette';
import { useAvatarImage } from '@/utility/UtilityHooks';

import styled from 'styled-components';

import { ProfilePicture } from '../ProfilePicture';
import { SingleCheckmarkSVG } from '../Svg';

const InputFieldStyled = styled.input`
  width: 98%;
  padding-left: 2%;
  border: none;
  outline: none;
  height: 2rem;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: 1px solid #ededed;
`;
const InputFieldLabelStyled = styled.div`
  font-weight: 500px;
`;

const InputFieldContainerStyled = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InputFieldDropdownStyled = styled.div`
  width: 98%;
  padding-left: 2%;
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: 1px solid #ededed;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  display: flex;
  align-items: center;
  line-height: 0.9rem;
`;

type InputFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const DropdownItem = styled.span`
  outline: 1px solid #ededed;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-weight: bold;
  border-radius: 5px;
`;

const SelectInputContainer = styled.div`
  .rc-select {
    outline: 1px solid green;
  }
`;

const options = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC' },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

export const InputField: FC<InputFieldProps> = props => {
  return (
    <InputFieldContainerStyled>
      <InputFieldLabelStyled>{props.label}</InputFieldLabelStyled>
      <InputFieldStyled
        placeholder={props.placeholder}
        value={props.value}
        onChange={e =>
          props.onValueChange && props.onValueChange(e.target.value)
        }
      />
    </InputFieldContainerStyled>
  );
};

const CustomOptionStyled = styled.div`
  ${commonCss.transition}
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  padding-left: 10px;
  cursor: pointer;
  :hover {
    background-color: rgba(200, 200, 200, 0.2);
  }
`;

const CircleArtifact = styled.span<{ $color: string }>`
  background-color: ${props => props.$color};
  aspect-ratio: 1 / 1;
  border-radius: 50%;
`;

const CustomOptionLeftStyled = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  gap: 10px;
  align-items: center;
`;

const CustomOptionRightStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  > svg {
    height: 20px;
    aspect-ratio: 1 / 1;
    color: gray;
  }
`;

const CustomOption: FC<PropsWithChildren<any>> = ({ innerProps, ...props }) => {
  const [imageUrl, _] = useAvatarImage(props.data.id, 'DIRECT');
  return (
    <CustomOptionStyled onClick={innerProps.onClick}>
      <CustomOptionLeftStyled>
        {/* <CircleArtifact $color={props.data.color}/> */}
        <ProfilePicture width={30} imageUrl={imageUrl} />
        {props.children}
      </CustomOptionLeftStyled>
      <CustomOptionRightStyled>
        {props.isSelected && <SingleCheckmarkSVG />}
        {/* <input type="checkbox" checked={props.isSelected}/> */}
      </CustomOptionRightStyled>
    </CustomOptionStyled>
  );
};

const CustomMultiValueStyled = styled.div`
  outline: 1px solid rgba(200, 200, 200);
  display: grid;
  grid-template-columns: 20px auto;
  gap: 7px;
  align-items: center;
  padding: 5px 10px;
  border-radius: 7px;
`;

type ColorOption = {
  value: string;
  label: string;
  color: string;
};

const LabelWrapper = styled.span<{ $color: string }>`
  color: ${props => props.$color};
`;

const CustomMultiValue: FC<PropsWithChildren<any>> = ({
  innerProps,
  ...props
}) => {
  const [imageUrl, _] = useAvatarImage(props.data.id, 'DIRECT');
  return (
    <>
      {/* <CircleArtifact $color={props.data.color}/> */}
      <ProfilePicture width={20} imageUrl={imageUrl} />
      {props.children}
    </>
  );
};

const CustomMultiValueContainer: FC<PropsWithChildren<any>> = ({
  innerProps,
  ...props
}) => {
  return <CustomMultiValueStyled>{props.children}</CustomMultiValueStyled>;
};

const CustomValueContainerStyled = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  gap: 7px;
  flex-wrap: wrap;
  /* outline: 1px solid red; */
`;

const CustomValueContainer: FC<ValueContainerProps> = ({
  innerProps,
  ...props
}) => {
  return (
    <components.ValueContainer {...props}>
      <CustomValueContainerStyled>{props.children}</CustomValueContainerStyled>
    </components.ValueContainer>
  );
};

const CustomMultiValueRemoveStyled = styled.div`
  background-color: red;
  aspect-ratio: 1 / 1;
`;

const CustomMultiValueRemove: FC<PropsWithChildren<any>> = ({
  innerProps,
  ...props
}) => {
  return <></>;
};

const CustomPlaceholder: FC<PropsWithChildren<any>> = props => {
  return <></>;
  // return (<components.Placeholder {...props}/>)
};

type InputFieldSearchableDropDownOption = {
  id: number;
  label: string;
  value: string;
};

type InputFieldSearchableDropDownProps = {
  label: string;
  placeholder: string;
  options?: InputFieldSearchableDropDownOption[];
  onChangeSelection?: (selection: number[]) => void;
};

export const InputFieldSearchableDropDown: FC<
  InputFieldSearchableDropDownProps
> = props => {
  const options = props.options ?? [];
  return (
    <InputFieldContainerStyled>
      <InputFieldLabelStyled>{props.label}</InputFieldLabelStyled>
      <Select
        isMulti
        placeholder=''
        options={options}
        components={{
          Option: CustomOption,
          MultiValueLabel: CustomMultiValue,
          MultiValueContainer: CustomMultiValueContainer,
          ValueContainer: CustomValueContainer,
          Placeholder: CustomPlaceholder,
          MultiValueRemove: CustomMultiValueRemove,
        }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        onChange={val =>
          props.onChangeSelection &&
          props.onChangeSelection(
            (val as InputFieldSearchableDropDownOption[]).map(s => s.id)
          )
        }
      />
    </InputFieldContainerStyled>
  );
};
