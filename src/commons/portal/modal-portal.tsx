import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface IModalPortalProps {
  children: ReactNode;
}

export const ModalPortal = ({ children }: IModalPortalProps) => {
  const el = document.getElementById("modal"); // id가 modal인 요소를 찾음
  return ReactDOM.createPortal(children, el as HTMLElement); // 찾은 요소에 children을 렌더링
};

export default ModalPortal;
