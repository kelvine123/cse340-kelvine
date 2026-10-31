import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCategories,
  buildHome,
  buildOrganizations,
  buildProjects,
} from './controllers/baseController.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(currentDirectory, 'views'));
app.use(express.static(path.join(currentDirectory, 'public')));

app.get('/', buildHome);
app.get('/organizations', buildOrganizations);
app.get('/projects', buildProjects);
app.get('/categories', buildCategories);

app.use((request, response) => {
  response.status(404).send('Page not found');
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send('Unable to render this page right now.');
});

app.listen(port, '0.0.0.0');
