import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as postsApi from "../../api/posts";
import type { TMediaType } from "../../types/post";
import { postPath } from "../../router";
import { toastError } from "../../lib/toast";
import styles from "./CreatePostPage.module.scss";

export const CreatePostPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<TMediaType>("image");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!file) {
      toastError(null, "Выберите файл");
      return;
    }
    setSubmitting(true);

    try {
      const post = await postsApi.createPost({ file, caption, mediaType });
      navigate(postPath(post._id));
    } catch (err) {
      toastError(err, "Ошибка создания поста");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <h2>Новый пост</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as TMediaType)}
          >
            <option value="image">Изображение</option>

            <option value="video">Видео</option>
          </select>
        </div>
        <div>
          <input
            type="file"
            accept={mediaType === "image" ? "image/*" : "video/*"}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div>
          <textarea
            placeholder="Описание"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <button type="submit" disabled={submitting}>
          Опубликовать
        </button>
      </form>
    </main>
  );
};

export default CreatePostPage;
