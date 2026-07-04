import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as postsApi from "../../api/posts";
import type { TMediaType } from "../../types/post";
import { postPath } from "../../router";
import { toastError } from "../../lib/toast";
import styles from "./CreatePostPage.module.scss";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, CircularProgress, TextField } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { validateField } from "../../utils/validation";
import { isValidPostFile } from "../../utils/fileTypes";

const MAX_CAPTION_LENGTH = 2200;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const HiddenInput = styled("input")({
  display: "none",
});

export const CreatePostPage = () => {
  const navigate = useNavigate();

  const [caption, setCaption] = useState<string>("");
  const [captionError, setCaptionError] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const mediaType: TMediaType | null = file
    ? file.type.startsWith("video/")
      ? "video"
      : "image"
    : null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!isValidPostFile(selectedFile)) {
      toastError(null, "Поддерживаются JPG, PNG, WEBP, MP4, MOV и MKV");

      e.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toastError(null, "Размер файла не должен превышать 50 МБ");

      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const validate = () => {
    const captionError = validateField("caption", caption);
    setCaptionError(captionError);
    return !captionError;
  };

  const handlePublishPost = async () => {
    if (!file || !mediaType) {
      toastError(null, "Выберите файл");
      return;
    }
    if (!validate()) return;
    setSubmitting(true);

    try {
      const post = await postsApi.createPost({
        file,
        caption,
        mediaType,
      });
      navigate(postPath(post._id));
    } catch (err) {
      toastError(err, "Ошибка создания поста");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCaption("");
    setCaptionError("");
    setFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main className={styles.main}>
      <h2>Новый пост</h2>
      {!file ? (
        <div className={styles.fileWrapper}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ marginTop: "-100px" }}
          >
            Нажмите для загрузки медиа
            <HiddenInput
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Button>
        </div>
      ) : (
        <div className={styles.postWrapper}>
          <div className={styles.mediaWrapper}>
            {mediaType === "image" ? (
              <img
                src={previewUrl!}
                alt="preview"
                className={styles.previewImage}
              />
            ) : (
              <video
                src={previewUrl!}
                controls
                className={styles.previewVideo}
              />
            )}
          </div>
          <div className={styles.captionWrapper}>
            <TextField
              fullWidth
              multiline
              rows={18}
              label="Описание"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (captionError) {
                  setCaptionError("");
                }
              }}
              slotProps={{
                htmlInput: {
                  maxLength: MAX_CAPTION_LENGTH,
                },
                formHelperText: {
                  sx: {
                    textAlign: "right",
                    margin: 0,
                  },
                },
              }}
              helperText={
                captionError || `${caption.length}/${MAX_CAPTION_LENGTH}`
              }
              error={!!captionError}
              disabled={submitting}
            />
            <div className={styles.btns}>
              <Button
                variant="contained"
                disabled={submitting}
                onClick={handlePublishPost}
              >
                {submitting ? (
                  <CircularProgress aria-label="Loading…" size="25px" />
                ) : (
                  "Опубликовать"
                )}
              </Button>
              <Button
                variant="text"
                disabled={submitting}
                onClick={resetForm}
                endIcon={<RotateLeftIcon color="primary" />}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreatePostPage;
