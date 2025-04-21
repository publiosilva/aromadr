import express from 'express';
import cors from 'cors';
import { Express } from 'express';
import { setupRoutes } from './main/routes';

const app: Express = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(cors());

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
