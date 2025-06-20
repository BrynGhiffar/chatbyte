import { FC } from 'react';

import { useLogout } from '@/utility/UtilityHooks';

import ConfirmPopupWindow from '@components/ConfirmPopupWindow';

export const PopupLogoutWindow: FC = () => {
  const logout = useLogout();
  return (
    <ConfirmPopupWindow
      popupMainLabel='Do you want to logout?'
      leftButtonLabel='Cancel'
      rightButtonLabel='Logout'
      onClickLeftButton={c => c.dismiss()}
      onClickRightButton={c => {
        logout();
        c.dismiss();
      }}
    />
  );
};
