import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Simple Queries", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("05", "06");
  }, minutes(3));

  it(
    "should select total budget and revenue from movies, by using adjusted financial data",
    async done => {
      const query = (`SELECT ROUND (SUM (budget_adj) , 2) AS total_budget, ROUND (SUM (revenue_adj) , 2) AS total_revenue FROM movies`);
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        total_budget: 190130349695.48,
        total_revenue: 555818960433.08
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select count from movies where budget was more than 100000000 and release date after 2009",
    async done => {
      const query = (`SELECT COUNT(budget) AS count FROM movies WHERE budget > 100000000`);
      
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(282);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three movies order by budget where release data is after 2009",
    async done => {
      const query = `SELECT original_title, budget, revenue
                      FROM movies
                      WHERE release_date > 01/01/2009 ORDER BY budget DESC
                      LIMIT 3;`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          budget: 425000000.0,
          revenue: 11087569.0
        },
        {
          original_title: "Pirates of the Caribbean: On Stranger Tides",
          budget: 380000000.0,
          revenue: 1021683000.0
        },
        {
          original_title: "Pirates of the Caribbean: At World's End",
          budget: 300000000.0,
          revenue: 961000000.0
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies where homepage is secure (starts with https)",
    async done => {
      const query = (`SELECT COUNT (homepage) AS count FROM movies WHERE homepage like 'https%'`);
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(82);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies released every year",
    async done => {
      const query = `SELECT COUNT(*)  AS count,
                      SUBSTR(release_date, 1, 4) AS year
                      FROM movies
                      GROUP BY year
                      ORDER BY year DESC    
      `;
      const result = await db.selectMultipleRows(query);

      expect(result.length).toBe(56);
      expect(result.slice(0, 3)).toEqual([
        {
          count: 627,
          year: "2015"
        },
        {
          count: 696,
          year: "2014"
        },
        {
          count: 656,
          year: "2013"
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three users which left most ratings",
    async done => {
      const query = `SELECT COUNT(rating) AS count, user_id
                      FROM movie_ratings
                      GROUP BY user_id
                      ORDER BY count DESC
                      LIMIT 3;`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          user_id: 8659,
          count: 349
        },
        {
          user_id: 179792,
          count: 313
        },
        {
          user_id: 107720,
          count: 294
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of ratings left each month",
    async done => {
      const query = `SELECT strftime('%m', time_created) as month,
                     COUNT(rating) AS count
                     FROM movie_ratings
                     GROUP BY month
                     ORDER BY count DESC `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          count: 161252,
          month: "11"
        },
        {
          count: 146804,
          month: "12"
        },
        {
          count: 144545,
          month: "07"
        },
        {
          count: 141643,
          month: "10"
        },
        {
          count: 136058,
          month: "06"
        },
        {
          count: 131934,
          month: "01"
        },
        {
          count: 130411,
          month: "05"
        },
        {
          count: 129070,
          month: "03"
        },
        {
          count: 127299,
          month: "08"
        },
        {
          count: 119368,
          month: "04"
        },
        {
          count: 108811,
          month: "02"
        },
        {
          count: 103819,
          month: "09"
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select longest movie from movies, by runtime",
    async done => {
      const query = (`SELECT runtime, original_title
                      FROM movies
                      ORDER BY runtime DESC
                      LIMIT 1;`);
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        runtime: 900,
        original_title: 'The Story of Film: An Odyssey'
      });

      done();
    },
    minutes(3)
  );
  it(
    "should select top 3 most popular from movies, where budget is less than 25000000, by popularity",
    async done => {
      const query = (`SELECT original_title, budget, ROUND(popularity, 2) AS popularity
                      FROM movies
                      WHERE budget < 25000000
                      ORDER BY popularity DESC
                      LIMIT 3;`);
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: 'Star Wars',
          budget: 11000000,
          popularity: 12.04
        },
        {
          original_title: 'John Wick',
          budget: 20000000,
          popularity: 11.42
        },
        {
          original_title: 'Underworld: Endless War',
          budget: 0,
          popularity: 8.41
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select movie with most adjusted budjet in movies and return budget difference",
    async done => {
      const query = (`SELECT original_title, ROUND((budget - budget_adj), 2) AS difference
                      FROM movies
                      ORDER BY difference DESC
                      LIMIT 1;`);
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        difference: 22400113.3,
        original_title: 'Avengers: Age of Ultron'
      });

      done();
    },
    minutes(3)
  );
});
