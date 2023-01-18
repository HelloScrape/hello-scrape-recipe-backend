import express, { Response, Request } from 'express';
import recipe from '../models/recipe';
import log from 'fancy-log';

const router = express.Router();

router.get('/', async function (req: Request, res: Response) {
  const recipes = await recipe.find({});
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({ data: recipes, error: null, imageUrl: process.env.PUBLIC_IMAGES_PATH });
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
  const recipes = await recipe.find({ language: req.params.language });
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({ data: recipes, error: null, imageUrl: process.env.PUBLIC_IMAGES_PATH });
});

router.post('/id/:id', async function (req: Request, res: Response) {
  const recipes = await recipe.findOne({ _id: req.params.id });
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.json({ data: recipes, error: null, imageUrl: process.env.PUBLIC_IMAGES_PATH });
});

export default router;
