import type { ReactNode } from "react";

export interface IModalOverlay {
  children: ReactNode;
  onClick: () => void;
}
