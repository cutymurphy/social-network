import type { ReactNode } from "react";

export interface IModal {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  title?: string;
}
