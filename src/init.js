import app from './server.js';

const handleListening = () => {
  console.log('Server listening on port http://localhost:4000');
};

app.listen(4000, handleListening);
