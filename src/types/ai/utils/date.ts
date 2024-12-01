export const formatCreatedDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTimestamp = `${day}/${month}/${year} - ${hours}:${minutes}`;

  return formattedTimestamp;
};

export const getShortDateTime = () => {
  return new Date().toISOString().slice(0, 16);
};
