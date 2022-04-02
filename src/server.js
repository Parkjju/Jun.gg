import express from 'express';
import morgan from 'morgan';
import rootRouter from './routers/rootRouter';
import path from 'path';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public'));

app.use('/', rootRouter);

export default app;
