import { useTheme } from "@/store/AppStore/hooks";
import AllThemes from "@/theme";
import { FC } from "react";
import styled, { css } from "styled-components";


type ThemeType = {
    theme: "dark" | "light",
    color: string
};

const ThemeTitle = styled.h1`
    padding-left: 1rem;
`;


const ThemeColor: ThemeType[] = [
    {
        theme: "dark",
        color: "#222831"
    },
    {
        theme: "light",
        color: "#ffffff"
    }
];




const ThemeGridStyled = styled.div`
  /* outline: 1px solid red; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding-top: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  gap: 5px;
  > * {
    aspect-ratio: 1 / 1;
    border-radius: 5px;
    cursor: pointer;
  }
`;



const ThemeGridItemStyled = styled.div<{ $selected?: boolean, $backgroundColor: string }>`
    transition: all 100ms ease-out;
    box-sizing: border-box;
    background-color: ${props => props.$backgroundColor};
    position: relative;
    ${props => props.$selected && css`
        border: 5px solid #1bf5af;
    `}
    ${props => !props.$selected && css`
        border: 1px solid rgb(200,200,200);
    `}
`;

const ThemeGridItemArtifactStyled = styled.div`
    position: absolute;
    bottom: -2px;
    right: -2px;
    content: '';
    height: 20px;
    width: 20px;
    background-color: #1bf5af;
    border-radius: 4px;

`;

type ThemeGridItemProps = {
    color: string;
    selected?: boolean;
    onClick: () => void;
}

const ThemeGridItem: FC<ThemeGridItemProps> = (props) => {
    return (
        <ThemeGridItemStyled
            $backgroundColor={props.color}
            $selected={props.selected}
            onClick={props.onClick}
        >
            {props.selected && <ThemeGridItemArtifactStyled/>}
        </ThemeGridItemStyled>
    )
}


export const ThemeSettings: FC = () => {
    const [theme, setTheme] = useTheme();
    return (
        <>
            <ThemeTitle>
                Theme
            </ThemeTitle>
            <ThemeGridStyled>
                {
                    AllThemes.map(th => (
                        <ThemeGridItem
                            key={th.id}
                            selected={th.id === theme.id}
                            color={th.color}
                            onClick={() => {
                                setTheme(th.id);
                            }}
                        />
                    ))
                }
            </ThemeGridStyled>
        </>  
    );
};