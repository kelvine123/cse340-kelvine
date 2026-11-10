import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseRoute from './routes/baseRoute.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(currentDirectory, 'views'));
app.use(express.static(path.join(currentDirectory, 'public')));
app.use('/', baseRoute);

app.use((request, response) => {
  response.status(404).render('404', {
    pageTitle: 'Page not found',
    message: 'We could not find the page you were looking for.',
  });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error(error);
  response.status(500).render('500', {
    pageTitle: 'Something went wrong',
    message: 'Unable to load this page right now. Please try again later.',
  }, (renderError, pageHtml) => {
    if (renderError) {
      console.error(renderError);
      response.send('Unable to render this page right now.');
      return;
    }
    response.send(pageHtml);
  });
});

app.listen(port, '0.0.0.0');
