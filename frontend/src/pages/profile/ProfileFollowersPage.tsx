import { FollowListModal } from "../../components/organisms/FollowListModal";
import ProfilePageRoute from "./ProfilePageRoute";

export const ProfileFollowersPage = () => {
  return (
    <>
      <ProfilePageRoute />
      <FollowListModal mode="followers" />
    </>
  );
};

export default ProfileFollowersPage;
