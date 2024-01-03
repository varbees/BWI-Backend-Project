const generateImageURL = (req, path) => {
  return `${req.protocol}://${req.get('host')}/${path}`;
};

export default generateImageURL;
