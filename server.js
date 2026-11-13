import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import router from './src/routes.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const nodeEnvironment = (process.env.NODE_ENV || 'production').toLowerCase();

app.set('view engine', 'ejs');
app.set('views', path.join(currentDirectory, 'views'));
app.set('env', nodeEnvironment);
app.locals.NODE_ENV = nodeEnvironment;
app.use(express.static(path.join(currentDirectory, 'public')));

app.use(router);

app.use((request, response, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  console.error(error);
  if (response.headersSent) {
    return next(error);
  }

  const status = error.status === 404 ? 404 : 500;
  const pageTitle = status === 404 ? 'Page Not Found' : 'Server Error';
  response.status(status).render(`errors/${status}`, {
    pageTitle,
    currentPage: '',
    error: error.message,
    stack: error.stack,
    NODE_ENV: nodeEnvironment,
  });
});

app.listen(port, '0.0.0.0');
