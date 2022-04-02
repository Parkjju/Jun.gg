import path from 'path';
export const home = (req, res) => {
  return res.sendFile(path.join(__dirname + '../../../public/index.html'));
};
