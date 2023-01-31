import express, { Response, Request } from 'express';
import recipe, { recipeSchemaType } from '../models/recipe';
import log from 'fancy-log';

const router = express.Router();
const defaultPage = 1;
const defaultPageSize = 25;

router.get('/', async function (req: Request, res: Response) {
  let page = parseInt(req.query.page as string); //tslint:disable-line
  let pageSize = parseInt(req.query.pageSize as string); //tslint:disable-line

  if (isNaN(page)) {
    page = defaultPage;
  }
  if (isNaN(pageSize)) {
    pageSize = defaultPageSize;
  }

  let recipes = (await recipe.find({}, {}, { skip: (page - 1) * pageSize, limit: pageSize, sort: { createdAt: -1 } })) as any;
  recipes = fixRecipeImageUrls(recipes);
  recipes = filterRecipesWithoutImageOrName(recipes);
  recipes = cleanUpTitle(recipes);
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({
    data: recipes,
    error: null,
    imageUrl: process.env.PUBLIC_IMAGES_PATH,
    page,
    pageSize,
    total: Math.ceil((await recipe.countDocuments()) / pageSize),
  });
});

router.get('/language/:language', async function (req: Request, res: Response) {
  if (req.params.language.length !== 2) {
    res.status(400).json({ error: 'You must provide a valid language (en,nl,fr)!', data: null });
    return;
  }
  if (req.params.language !== 'nl' && req.params.language !== 'en' && req.params.language !== 'fr') {
    res.status(400).json({ error: 'You must provide a valid language (en,nl,fr)!', data: null });
    return;
  }

  let page = parseInt(req.query.page as string); //tslint:disable-line
  let pageSize = parseInt(req.query.pageSize as string); //tslint:disable-line

  if (isNaN(page)) {
    page = defaultPage;
  }
  if (isNaN(pageSize)) {
    pageSize = defaultPageSize;
  }

  let recipes = (await recipe.find(
    { language: req.params.language },
    {},
    { skip: (page - 1) * pageSize, limit: pageSize, sort: { createdAt: -1 } }
  )) as any;
  recipes = fixRecipeImageUrls(recipes);
  recipes = filterRecipesWithoutImageOrName(recipes);
  recipes = cleanUpTitle(recipes);
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({
    data: recipes,
    error: null,
    imageUrl: process.env.PUBLIC_IMAGES_PATH,
    page,
    pageSize,
    total: Math.ceil((await recipe.countDocuments({ language: req.params.language })) / pageSize),
  });
});

router.get('/id/:id', async function (req: Request, res: Response) {
  let recipes = fixRecipeImageUrls(await recipe.find({ _id: req.params.id }));
  recipes = filterRecipesWithoutImageOrName(recipes);
  recipes = cleanUpTitle(recipes);
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({ data: recipes, error: null, imageUrl: process.env.PUBLIC_IMAGES_PATH });
});

export default router;

function fixRecipeImageUrls(recipes: recipeSchemaType[]): recipeSchemaType[] {
  recipes.forEach(recipeItem => {
    recipeItem.images = recipeItem.images.map(image => {
      // remove \n before and after the image name
      image = image.replace(/(\r\n|\n|\r)/gm, '').trim();
      return `${process.env.PUBLIC_IMAGES_PATH}/${image}`;
    });
  });
  return recipes;
}

function filterRecipesWithoutImageOrName(recipes: recipeSchemaType[]): recipeSchemaType[] {
  return recipes.filter(recipeItem => {
    return !recipeItem.recipeName.includes('recipeName') && recipeItem.images && recipeItem.images.length > 0;
  });
}

function cleanUpTitle(recipes: recipeSchemaType[]): recipeSchemaType[] {
  recipes.forEach(recipeItem => {
    recipeItem.recipeName = recipeItem.recipeName.split('naar meer?')[0].trim();
  });
  return recipes;
}
