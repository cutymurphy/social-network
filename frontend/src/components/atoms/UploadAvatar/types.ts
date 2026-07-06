export interface IUploadAvatar {
  src: string;
  size?: string;
  onAvatarChange?: (avatarUrl: string) => void;
}
