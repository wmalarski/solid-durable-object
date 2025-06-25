export const getGameId = (url: string) => {
  const slices = url.split("/");
  const gameId = slices.at(-2);
  return gameId;
};
