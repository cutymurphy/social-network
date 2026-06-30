import { useParams } from "react-router-dom";
import { ProfilePage } from "./ProfilePage";

export const ProfilePageRoute = () => {
  const { id = "" } = useParams();
  return <ProfilePage key={id} />;
};

export default ProfilePageRoute;
