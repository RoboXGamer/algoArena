import express from 'express';
import { getPotd } from '../controllers/potd.controller.js';

export const potdRouter = express.Router();

potdRouter.get("/get-potd", getPotd);