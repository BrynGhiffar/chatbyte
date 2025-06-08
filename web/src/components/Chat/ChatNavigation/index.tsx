import { FC } from 'react';

import { ProfilePicture } from '@/components/common/ProfilePicture';
import { useSelectedContact } from '@/store/AppStore/hooks';
import { useAvatarImage } from '@/utility/UtilityHooks';

import { TH__ChatNavigation, TH__ChatNavigationName } from './styled';

const ChatNavigation: FC = () => {
  const contact = useSelectedContact();
  const name = contact?.name;
  const uid = contact?.id ?? null;
  const type = contact?.type ?? 'DIRECT';
  const [avatarImage] = useAvatarImage(uid ?? null, type);
  return (
    <TH__ChatNavigation>
      <ProfilePicture imageUrl={avatarImage} />
      <TH__ChatNavigationName>{name}</TH__ChatNavigationName>
    </TH__ChatNavigation>
  );
};

export default ChatNavigation;
