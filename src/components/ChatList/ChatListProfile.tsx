import { FC, useCallback } from 'react';
import useAppStore from '@/store/AppStore';
import { useAvatarImage } from '@/utility/UtilityHooks';
import { DivMouseEvent } from '@/misc/types';
import styled from 'styled-components';
import { color, colorConfig, commonCss, font } from '../Palette';
import { ProfilePictureWithStatus } from '../common/ProfilePicture';
import { ChevronDownSVG } from '../common/Svg';

const ChatListProfileStyled = styled.div`
  width: 100%;
  background-color: ${colorConfig.chatNavBackgroundColor};
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const ProfileDetailContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 50px 1fr;
    align-items: center;
    padding-left: 1rem;
    gap: 1rem;
`;

const ProfileDetailControlsContainer = styled.div`
    height: 100%;
    display: grid;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
`;


const ChatListProfileMoreButton = styled.div<{$clicked?: boolean}>`
    position: relative;
    ${commonCss.transition}
    height: 25px;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    border-radius: 5px;
    /* background-color: ${props => props.$clicked ? '#2a4fb2' : 'transparent'}; */
    :hover {
        background-color: #2a4fb2;
    }
    > svg {
        color: white;
    }
`

const ChatListProfileNameStyled = styled.span`
    font-family: ${font.appleFont};
    color: ${color.white};
    font-size: 1rem;
    font-weight: bold;
`;

const ChatListProfile: FC = () => {
    const [userId, username] = useAppStore(s => [s.loggedInUserId, s.loggedInUsername]);
    const pushWindow = useAppStore(s => s.pushWindow);
    const [avatarImage] = useAvatarImage(userId);
  
    const onProfileMoreButton = useCallback((e: DivMouseEvent) => {
      e.stopPropagation();
      pushWindow("SETTINGS_WINDOW");
    }, [pushWindow]);
  
    return (
      <ChatListProfileStyled>
          <ProfileDetailContainer>
              <ProfilePictureWithStatus
                  imageUrl={avatarImage} 
                  statusOutlineColor={colorConfig.chatNavBackgroundColor}
                  online
              />
              <ChatListProfileNameStyled>{username}</ChatListProfileNameStyled>
          </ProfileDetailContainer>
          <ProfileDetailControlsContainer>
              <ChatListProfileMoreButton onClick={onProfileMoreButton}>
                  <ChevronDownSVG/>
                  {/* {showPopup && <PopupWindow/>} */}
              </ChatListProfileMoreButton>
          </ProfileDetailControlsContainer>
      </ChatListProfileStyled>
    );
  };

export default ChatListProfile;