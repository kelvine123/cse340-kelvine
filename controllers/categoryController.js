import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
} from '../src/models/categories.js';
import { isValidId, renderNotFound, renderPage } from './controllerUtils.js';

export async function buildCategories(request, response, next) {
  try {
    const categories = await getAllCategories();
    await renderPage(response, 'categories', {
      pageTitle: 'Categories',
      currentPage: 'categories',
      categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function buildCategoryDetail(request, response, next) {
  try {
    const { id } = request.params;
    if (!isValidId(id)) {
      await renderNotFound(response, 'Category not found', 'We could not find that category.');
      return;
    }

    const category = await getCategoryById(Number(id));
    if (!category) {
      await renderNotFound(response, 'Category not found', 'We could not find that category.');
      return;
    }

    const projects = await getProjectsByCategoryId(category.category_id);
    await renderPage(response, 'category', {
      pageTitle: category.category_name,
      currentPage: 'categories',
      category,
      projects,
    });
  } catch (error) {
    next(error);
  }
}
