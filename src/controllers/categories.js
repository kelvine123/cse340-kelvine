import {
  getAllCategories,
  getCategoryDetails,
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import {
  createNotFoundError,
  parseRouteId,
  withErrorHandling,
} from './controllerUtils.js';

export const showCategoriesPage = withErrorHandling(async (request, response) => {
  const categories = await getAllCategories();
  response.render('categories', {
    pageTitle: 'Categories',
    currentPage: 'categories',
    categories,
  });
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
