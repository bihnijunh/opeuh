declare module 'nested-modal' {
    import { ReactNode } from 'react';
  
    export interface NestedModalProps {
      currentOpenedModal: string | null;
      setCurrentOpenedModal: (modal: string | null) => void;
      children: ReactNode;
    }
  
    export interface ModalChildProps {
      id: string;
      title: string;
      children: ReactNode;
    }
  
    export const NestedModal: React.FC<NestedModalProps>;
    export const ModalChild: React.FC<ModalChildProps>;
  }