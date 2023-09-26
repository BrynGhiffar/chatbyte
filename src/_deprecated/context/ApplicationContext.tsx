import { FC, PropsWithChildren, useEffect } from "react";
import useAppStore from "@/store/AppStore";

export const ApplicationContext: FC<PropsWithChildren> = (props) => {


  return props.children;
}
