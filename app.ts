import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { setupSwagger } from './swagger.config';
import { pingSelf } from './functions';

//#region App Setup
const app = express();

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
setupSwagger(app, BASE_URL);

//#endregion App Setup

//#region Code here

/**
 * @swagger
 * /assessment/{id}:
 *   get:
 *     summary: Fetch an object from the external API (restful-api.dev)
 *     description: Returns the object from the external API based on the given ID.
 *     tags: [Assessment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         required: true
 *         description: Numeric ID between 1 and 10 to fetch the object.
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Failed to call external API.
 */
app.get('/assessment/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Validate if the ID is between 1 and 10
  if (isNaN(id) || id < 1 || id > 10) {
    return res
      .status(400)
      .send({ error: 'ID must be an integer between 1 and 10' });
  }

  try {
    // Make a call to the external API using the ID
    const result = await axios.get(`https://api.restful-api.dev/objects/${id}`);

    // Send the result back
    return res.send({
      success: true,
      message: `External API called with ID ${id}`,
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error calling external API:', error.message);
    return res.status(500).send({ error: 'Failed to call external API' });
  }
});

//#endregion

//#region Server Setup

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health check
 *     description: Returns an object containing demo content
 *     tags: [Default]
 *     responses:
 *       '200':
 *         description: Successful.
 *       '400':
 *         description: Bad request.
 */
app.get('/', (req: Request, res: Response) => {
  return res.send({ message: 'API is Live!' });
});

/**
 * @swagger
 * /obviously/this/route/cant/exist:
 *   get:
 *     summary: API 404 Response
 *     description: Returns a non-crashing result when you try to run a route that doesn't exist
 *     tags: [Default]
 *     responses:
 *       '404':
 *         description: Route not found
 */
app.use((req: Request, res: Response) => {
  return res
    .status(404)
    .json({ success: false, message: 'API route does not exist' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // throw Error('This is a sample error');

  console.log(`${'\x1b[31m'}${err.message}${'\x1b][0m]'} `);
  return res
    .status(500)
    .send({ success: false, status: 500, message: err.message });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

// (for free render services) Keep the API awake by pinging it periodically
setInterval(() => pingSelf(BASE_URL), 600000);

//#endregion
