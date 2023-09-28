import { FC, useCallback } from 'react';
import useAppStore from '@/store/AppStore';
import { useAvatarImage } from '@/utility/UtilityHooks';
import { DivMouseEvent } from '@/misc/types';
import styled from 'styled-components';
import { SC__ProfileDetailContainer, SC__ProfileDetailControlsContainer, TH__ChatListProfileContainer, TH__ChatListProfileMoreButton, TH__ChatListProfileName } from './styled';
import { ProfilePictureWithStatus } from '@/components/common/ProfilePicture';
import { useColorConfig } from '@/store/AppStore/hooks';
import { ChevronDownSVG } from '@/components/common/Svg';



const ChatListProfile: FC = () => {
    const [userId, username] = useAppStore(s => [s.loggedInUserId, s.loggedInUsername]);
    const pushWindow = useAppStore(s => s.pushWindow);
    const [avatarImage] = useAvatarImage(userId);
    const backgroundColor = useColorConfig().chatNavBackgroundColor;
    const onProfileMoreButton = useCallback((e: DivMouseEvent) => {
      e.stopPropagation();
      pushWindow({ type: "SETTINGS_WINDOW" });
    }, [pushWindow]);
  
    return (
      <TH__ChatListProfileContainer>
          <SC__ProfileDetailContainer>
              <ProfilePictureWithStatus
                  imageUrl={avatarImage} 
                  statusOutlineColor={backgroundColor}
                  online
              />
              <TH__ChatListProfileName>{username}</TH__ChatListProfileName>
          </SC__ProfileDetailContainer>
          <SC__ProfileDetailControlsContainer>
              <TH__ChatListProfileMoreButton onClick={onProfileMoreButton}>
                  <ChevronDownSVG/>
                  {/* {showPopup && <PopupWindow/>} */}
              </TH__ChatListProfileMoreButton>
          </SC__ProfileDetailControlsContainer>
      </TH__ChatListProfileContainer>
    );
  };

export default ChatListProfile;