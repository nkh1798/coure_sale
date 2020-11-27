const getParamFromUrl = (key) => {
  const urlParams = new URL(window.location.href);
  return urlParams.get(key);
};

export default getParamFromUrl;
