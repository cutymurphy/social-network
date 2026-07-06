export const formatPostDate = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин.`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч.`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн.`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} нед.`;

  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
};
