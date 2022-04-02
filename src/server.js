import express from 'express';

const app = express();

const handleListening = () => {
  console.log('Server listening!');
};

app.listen(4000, handleListening);
