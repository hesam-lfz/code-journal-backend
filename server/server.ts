/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';
import { EntryType } from 'perf_hooks';

export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "entries"
        order by "entryId"
    `;
    const result = await db.query<Entry>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
