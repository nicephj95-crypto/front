import { ReactNode } from "react";
import styled from "styled-components";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <Backdrop role="presentation" onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
        <Header>
          {title && <h3>{title}</h3>}
          <CloseButton type="button" aria-label="모달 닫기" onClick={onClose}>
            ×
          </CloseButton>
        </Header>
        <Content>{children}</Content>
      </Dialog>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  width: min(520px, 90%);
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
`;

const Content = styled.div`
  margin-top: 12px;
  line-height: 1.5;
`;

export default Modal;
