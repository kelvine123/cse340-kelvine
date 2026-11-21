import bcrypt from 'bcryptjs';
import {
  createUser,
  getAllUsers,
  getUserByUsername,
} from '../models/users.js';
import { withErrorHandling } from './controllerUtils.js';

const renderAuthForm = (response, view, pageTitle, values = {}, errors = {}, status = 200) => {
  response.status(status).render(view, {
    pageTitle,
    currentPage: view,
    values,
    errors,
  });
};

export const registerPage = (request, response) => {
  renderAuthForm(response, 'register', 'Register');
};

export const register = withErrorHandling(async (request, response) => {
  const values = {
    first_name: typeof request.body.first_name === 'string' ? request.body.first_name.trim() : '',
    last_name: typeof request.body.last_name === 'string' ? request.body.last_name.trim() : '',
    username: typeof request.body.username === 'string' ? request.body.username.trim().toLowerCase() : '',
    password: typeof request.body.password === 'string' ? request.body.password : '',
  };
  const errors = {};
  if (!values.first_name) errors.first_name = 'Enter a first name.';
  if (!values.last_name) errors.last_name = 'Enter a last name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.username)) {
    errors.username = 'Enter a valid email address.';
  }
  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (await getUserByUsername(values.username)) {
    errors.username = 'An account already exists with that email address.';
  }
  if (Object.keys(errors).length > 0) {
    return renderAuthForm(response, 'register', 'Register', values, errors, 400);
  }

  const user = await createUser(values);
  request.session.user = user;
  request.session.flashMessage = 'Your account has been created.';
  response.redirect('/dashboard');
});

export const loginPage = (request, response) => {
  renderAuthForm(response, 'login', 'Log In');
};

export const login = withErrorHandling(async (request, response) => {
  const username = typeof request.body.username === 'string'
    ? request.body.username.trim().toLowerCase()
    : '';
  const password = typeof request.body.password === 'string' ? request.body.password : '';
  const user = await getUserByUsername(username);
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
  if (!passwordMatches) {
    return renderAuthForm(
      response,
      'login',
      'Log In',
      { username },
      { login: 'Invalid email or password.' },
      401,
    );
  }

  request.session.user = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    role: user.role,
  };
  request.session.flashMessage = `Welcome back, ${user.first_name}.`;
  response.redirect('/dashboard');
});

export const logout = (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
};

export const showUsersPage = withErrorHandling(async (request, response) => {
  const users = await getAllUsers();
  response.render('users', {
    pageTitle: 'Registered Users',
    currentPage: 'users',
    users,
  });
});
