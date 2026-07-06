export interface IComment {
  user: {
    _id: string;
    nickname: string;
    avatarUrl?: string;
  };
  text: string;
  createdAt: string;
  canDelete?: boolean;
  onDelete?: () => void;
  onNavigate?: () => void;
}
