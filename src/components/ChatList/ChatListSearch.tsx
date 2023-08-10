import styled from "styled-components";
import { color, font } from "@/components/Palette";
import { FC } from "react";
import { useChatListSearch } from "@/utility/UtilityHooks";

const ChatListSearchStyled = styled.div`
  background-color: ${color.darkBlue};
  overflow: hidden;
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 90%;
`;

const ChatListTitle = styled.div`
    color: white;
    font-weight: bold;
    font-size: 1.7rem;
    height: 100%;
    display: flex;
    align-items: end;
    font-family: ${font.appleFont};
`;

const ChatListSearchInput = styled.input`
    border: none;
    outline: none;
    display: block;
    border-radius: 4px;
    font-size: 1rem;
    padding: 0.5rem 0.3rem;
`;

const ChatListSearch: FC = () => {
  const [_, setSearch] = useChatListSearch();

  return (
    <ChatListSearchStyled>
        <ChatListTitle>Chats</ChatListTitle>
        <ChatListSearchInput type="text" placeholder="Search something" onChange={e => setSearch(e.target.value)}/>
    </ChatListSearchStyled>
  );
};

export default ChatListSearch;