import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthService } from '@/api/http/AuthService';
import { avatarImageGroupUrl, avatarImageUrl } from '@/api/http/UserService';
import useAppStore from '@/store/AppStore';

import { LocalStorage } from './LocalStorage';

export const useToken = () => {
  const navigate = useNavigate();
  const token = LocalStorage.getLoginToken();
  const logout = useLogout();
  useEffect(() => {
    const run = async () => {
      if (!token) {
        return logout();
      }
      const response = await AuthService.validateToken(token);
      if (!response.success) {
        return logout();
      }
    };
    run();
  }, [token, navigate]);
  return token || '';
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAppStore(s => s.logout);
  return () => {
    logout(() => navigate('/auth'));
  };
};

export const useAvatarImage = (
  uid: number | null,
  type: 'DIRECT' | 'GROUP' = 'DIRECT'
): [string, () => void] => {
  const [num, setNum] = useState(Math.floor(Math.random() * 1_000));
  const reload = () => {
    setNum(_ => Math.floor(Math.random() * 1_000));
  };
  if (uid === null) {
    return ['', reload];
  }
  const url =
    type === 'DIRECT'
      ? avatarImageUrl(uid)(num)
      : avatarImageGroupUrl(uid)(num);
  return [url, reload];
};
