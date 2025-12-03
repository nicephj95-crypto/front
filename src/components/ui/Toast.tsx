import { ReactNode, useEffect } from "react";
import styled from "styled-components";

interface ToastProps {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  duration?: number;
}

function Toast({ open, message, onClose, duration = 2200 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <ToastWrapper role="status" aria-live="polite">
      <ToastBody>{message}</ToastBody>
    </ToastWrapper>
  );
}

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ToastBody = styled.div`
  min-width: 240px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.third};
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
  font-weight: 700;
`;

export default Toast;
