export default (dataUrl) => {
  const data = dataUrl.split(",")[1];
  const text = window.atob(data);
  return text;
};
