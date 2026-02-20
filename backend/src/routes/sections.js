import { Router } from 'express';
import { store } from '../db/store.js';

export const sectionsRouter = Router();

sectionsRouter.get('/', (_, res) => {
  res.json({ sections: store.sections.findAll() });
});

sectionsRouter.get('/assortment/products', (_, res) => {
  res.json({ products: store.products.findAll() });
});

sectionsRouter.get('/reviews/list', (_, res) => {
  res.json({ reviews: store.reviews.findApproved() });
});

sectionsRouter.get('/:slug', (req, res) => {
  const section = store.sections.findBySlug(req.params.slug);
  if (!section) return res.status(404).json({ error: 'Not found' });
  res.json({ section });
});
