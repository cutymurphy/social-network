import { FollowListModal } from "../../components/organisms/FollowListModal";
import ProfilePageRoute from "./ProfilePageRoute";

export const ProfileFollowingPage = () => {
  return (
    <>
      <ProfilePageRoute />
      <FollowListModal mode="following" />
    </>
  );
};

export default ProfileFollowingPage;
