const getWordForm = (count: number, one: string, few: string, many: string) => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;

  return many;
};

export const getPostsLabel = (count: number) =>
  getWordForm(count, "публикация", "публикации", "публикаций");

export const getFollowersLabel = (count: number) =>
  getWordForm(count, "подписчик", "подписчика", "подписчиков");

export const getFollowingLabel = (count: number) =>
  getWordForm(count, "подписка", "подписки", "подписок");
