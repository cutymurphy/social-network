import { useParams } from "react-router-dom";
import { PostDetailPanel } from "../../components/organisms/PostDetail";
import { usePostDetail } from "../../hooks/usePostDetail";
import { useAuth } from "../../auth/AuthContext";
import styles from "./PostPage.module.scss";

export const PostPage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const detail = usePostDetail(id);

  return (
    <main className={styles.main}>
      <PostDetailPanel {...detail} userId={user?.userId} />
    </main>
  );
};

export default PostPage;
