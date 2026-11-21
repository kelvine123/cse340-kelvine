import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import router from './src/routes.js';
import { ensureAdminUser } from './src/models/users.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;
const nodeEnvironment = (process.env.NODE_ENV || 'production').toLowerCase();

app.set('view engine', 'ejs');
app.set('views', path.join(currentDirectory, 'views'));
app.set('env', nodeEnvironment);
app.locals.NODE_ENV = nodeEnvironment;
if (nodeEnvironment === 'production') {
  app.set('trust proxy', 1);
}
app.use(express.static(path.join(currentDirectory, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'common-ground-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: nodeEnvironment === 'production',
    sameSite: 'lax',
  },
}));
app.use((request, response, next) => {
  response.locals.currentUser = request.session?.user ?? null;
  response.locals.flashMessage = request.session?.flashMessage ?? null;
  if (request.session) {
    delete request.session.flashMessage;
  }
  next();
});

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

ensureAdminUser()
  .then(() => {
    app.listen(port, '0.0.0.0');
  })
  .catch((error) => {
    console.error('Failed to initialize authentication:', error);
    process.exit(1);
  });
