import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Foreign Keys", () => {
    let db: Database;
  
    beforeAll(async () => {
      db = await Database.fromExisting("08", "09");
    }, minutes(3));
  

it(
    "should select movie Jurassic World and update revenue to 200000000 ",
    async done => {
      const update = `
      UPDATE movies
      SET revenue = 200000000
      WHERE original_title = 'Jurassic World';
`
      const query = `
      SELECT original_title, revenue 
      FROM movies WHERE original_title = 'Jurassic World'
      LIMIT 1;
      `
      await db.execute(update);
      const result = await db.selectSingleRow(query);
      expect(result).toEqual({
        original_title: 'Jurassic World',
        revenue: 200000000
      });
      done();
    },
    minutes(2)
  );

  it(
    "should update movies 'Mission: Impossible - Rogue Nation' genre to Horror by original title",
    async done => {
      const update = `
      UPDATE movie_genres
      SET genre_id = (SELECT id FROM genres WHERE genre = 'Horror')
      WHERE movie_id = (SELECT id FROM movies WHERE original_title = 'Mission: Impossible - Rogue Nation')
      `
      const query = `
      SELECT original_title, genre
      FROM movie_genres 
      JOIN movies ON movie_genres.movie_id = movies.id
      JOIN genres ON movie_genres.genre_id = genres.id
      WHERE original_title = 'Mission: Impossible - Rogue Nation'
      `
      await db.execute(update);
      const result = await db.selectSingleRow(query);
      expect(result).toEqual({
        original_title: 'Mission: Impossible - Rogue Nation',
        genre: 'Horror'
      });
      done();
    },
    minutes(2)
  );
  it(
    "should update movies 'Furious 7' director to 'George Miller' by original title",
    async done => {
      const dirName = 'George Miller';
      const update = `
      UPDATE movie_directors
      SET director_id = (SELECT id FROM directors WHERE full_name = '${dirName}')
      WHERE movie_id = (SELECT id FROM movies WHERE original_title = 'Furious 7')
      `
      const query = `
      SELECT original_title, full_name AS director
      FROM movie_directors
      JOIN movies ON movie_directors.movie_id = movies.id
      JOIN directors ON movie_directors.director_id = directors.id
      WHERE original_title = 'Furious 7'
      `
      await db.execute(update);
      const result = await db.selectSingleRow(query);
      expect(result).toEqual({
        original_title: 'Furious 7',
        director: 'George Miller'
      });
      done();
    },
    minutes(2)
  );
});
