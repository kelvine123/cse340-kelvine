import {
  createCategory as createCategoryModel,
  getAllCategories,
  getCategoryDetails,
  updateCategory as updateCategoryModel,
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';
import { getValidationErrors } from '../middleware/validation.js';

const getCategoryName = (request) => (
  typeof request.body?.category_name === 'string'
    ? request.body.category_name.trim()
    : ''
);

const renderCategoryForm = (response, view, category, errors = {}, status = 200) => {
  response.status(status).render(view, {
    pageTitle: view === 'new-category' ? 'Create Category' : 'Edit Category',
    currentPage: 'categories',
    category,
    errors,
  });
};

export const showCategoriesPage = withErrorHandling(async (request, response) => {
  const categories = await getAllCategories();
  response.render('categories', {
    pageTitle: 'Categories',
    currentPage: 'categories',
    categories,
  });
});

export const createCategoryPage = (request, response) => {
  renderCategoryForm(response, 'new-category', { category_name: '' });
};

export const createCategory = withErrorHandling(async (request, response) => {
  const category = { category_name: getCategoryName(request) };
  const errors = getValidationErrors(request);
  if (Object.keys(errors).length > 0) {
    return renderCategoryForm(response, 'new-category', category, errors, 400);
  }

  await createCategoryModel(category.category_name);
  response.redirect('/categories');
});

export const editCategoryPage = withErrorHandling(async (request, response) => {
  const categoryId = parseRouteId(request.params.id, 'Category');
  const category = await getCategoryDetails(categoryId);
  if (!category) {
    throw createNotFoundError('Category');
  }
  renderCategoryForm(response, 'edit-category', category);
});

export const updateCategory = withErrorHandling(async (request, response) => {
  const categoryId = parseRouteId(request.params.id, 'Category');
  const existingCategory = await getCategoryDetails(categoryId);
  if (!existingCategory) {
    throw createNotFoundError('Category');
  }

  const category = { ...existingCategory, category_name: getCategoryName(request) };
  const errors = getValidationErrors(request);
  if (Object.keys(errors).length > 0) {
    return renderCategoryForm(response, 'edit-category', category, errors, 400);
  }

  const updatedCategory = await updateCategoryModel(categoryId, category.category_name);
  if (!updatedCategory) {
    throw createNotFoundError('Category');
  }
  response.redirect(`/category/${categoryId}`);
});

export const showCategoryDetailsPage = withErrorHandling(async (request, response) => {
  const categoryId = parseRouteId(request.params.id, 'Category');
  const category = await getCategoryDetails(categoryId);
  if (!category) {
    throw createNotFoundError('Category');
  }

  const projects = await getProjectsByCategoryId(categoryId);
  response.render('category', {
    pageTitle: category.category_name,
    currentPage: 'categories',
    category,
    projects,
  });
});
