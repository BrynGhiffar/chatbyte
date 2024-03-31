import { useEffect, useState } from "react";
import { LocalStorage } from "./LocalStorage";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/api/http/AuthService";
import { avatarImageGroupUrl, avatarImageUrl } from "@/api/http/UserService";

export const useToken = () => {
    const navigate = useNavigate();
    const token = LocalStorage.getLoginToken();
    useEffect(() => {
      const run = async () => {
        if (!token) {
            return navigate("/auth");
        }
        const response = await AuthService.validateToken(token);
        if (!response.success) {
          return navigate("/auth");
        }
      };
      run();
    }, [token, navigate]);
    return token || "";
};

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    LocalStorage.removeLoginToken();
    navigate("/auth");
  };
};

export const useAvatarImage = (uid: number | null, type: "DIRECT" | "GROUP" = "DIRECT"): [string, () => void] => {
  const [num, setNum] = useState(Math.floor(Math.random() * 1_000));
  const reload = () => {
    setNum(_ => Math.floor(Math.random() * 1_000));
  };
  if (uid === null) {
    return ["", reload]
  }
  const url = type === "DIRECT" ? avatarImageUrl(uid)(num) : avatarImageGroupUrl(uid)(num);
  return [ url, reload ];
};