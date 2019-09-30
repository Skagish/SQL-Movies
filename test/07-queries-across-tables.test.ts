import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("06", "07");
    }, minutes(3));

    it(
        "should select top three directors ordered by total budget spent in their movies",
        async done => {
            const query = `SELECT full_name AS director, ROUND (SUM (budget_adj) , 2) AS total_budget
            FROM movie_directors JOIN movies ON movies.id = movie_directors.movie_id
            JOIN directors ON directors.id = movie_directors.director_id
            GROUP BY director
            ORDER BY total_budget DESC
            LIMIT 3`;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    director: "Steven Spielberg",
                    total_budget: 2173663066.68
                },
                {
                    director: "Ridley Scott",
                    total_budget: 1740157354.14
                },
                {
                    director: "Michael Bay",
                    total_budget: 1501996071.5
                }
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select top 10 keywords ordered by their appearance in movies",
        async done => {
            const query = `SELECT COUNT(keyword) AS count, keyword
            FROM movie_keywords JOIN movies ON movies.id = movie_keywords.movie_id
            JOIN keywords ON keywords.id = movie_keywords.keyword_id
            GROUP BY keyword
            ORDER BY count DESC
            LIMIT 10;`;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    keyword: "woman director",
                    count: 411
                },
                {
                    keyword: "independent film",
                    count: 394
                },
                {
                    keyword: "based on novel",
                    count: 278
                },
                {
                    keyword: "sex",
                    count: 272
                },
                {
                    keyword: "sport",
                    count: 216
                },
                {
                    keyword: "murder",
                    count: 204
                },
                {
                    keyword: "musical",
                    count: 169
                },
                {
                    keyword: "biography",
                    count: 168
                },
                {
                    keyword: "new york",
                    count: 163
                },
                {
                    keyword: "suspense",
                    count: 157
                }
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select one movie which has highest count of actors",
        async done => {
            const query = `SELECT COUNT(full_name) AS count, original_title
            FROM movie_actors JOIN movies ON movies.id = movie_actors.movie_id
            JOIN actors ON actors.id = movie_actors.actor_id
            GROUP BY original_title
            ORDER BY count DESC
            LIMIT 1;
            `;
            const result = await db.selectSingleRow(query);

            expect(result).toEqual({
                original_title: "Hamlet",
                count: 20
            });

            done();
        },
        minutes(3)
    );

    it(
        "should select three genres which has most ratings with 5 stars",
        async done => {
            const query = `SELECT COUNT((SELECT genre FROM genres WHERE rating = 5  )) AS five_stars_count, genre
            FROM movie_ratings 
			JOIN movie_genres ON movie_genres.movie_id = movie_ratings.movie_id
			JOIN movies ON movies.id = movie_genres.movie_id
			JOIN genres ON genres.id = movie_genres.genre_id
            GROUP BY genre
            ORDER BY five_stars_count DESC
            LIMIT 3;`;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    genre: 'Drama',
                    five_stars_count: 143663
                },
                {
                    genre: 'Thriller',
                    five_stars_count: 96265
                },
                {
                    genre: 'Comedy',
                    five_stars_count: 81184
                },
            ]);

            done();
        },
        minutes(3)
    );

    it(
        "should select top three genres ordered by average rating",
        async done => {
            const query = `SELECT genre, ROUND(avg(rating), 2) AS avg_rating
            FROM movie_ratings 
			JOIN movie_genres ON movie_genres.movie_id = movie_ratings.movie_id
			JOIN movies ON movies.id = movie_genres.movie_id
			JOIN genres ON genres.id = movie_genres.genre_id
            GROUP BY genre
            ORDER BY avg_rating DESC
            LIMIT 3`;
            const result = await db.selectMultipleRows(query);

            expect(result).toEqual([
                {
                    genre: 'Western',
                    avg_rating: 3.64
                },
                {
                    genre: 'Crime',
                    avg_rating: 3.62
                },
                {
                    genre: 'Animation',
                    avg_rating: 3.6
                },
            ]);

            done();
        },
        minutes(3)
    );
    it(
        "should select actor with most aprearances in movies",
        async done => {
            const query = `SELECT COUNT(original_title) AS count, full_name
            FROM movie_actors JOIN movies ON movies.id = movie_actors.movie_id
            JOIN actors ON actors.id = movie_actors.actor_id
            GROUP BY full_name
            ORDER BY count DESC
            LIMIT 1;
            `;
            const result = await db.selectSingleRow(query);

            expect(result).toEqual({
                full_name: "Robert De Niro",
                count: 72
            });

            done();
        },
        minutes(3)
    );
    it(
        "should select horror movies",
        async done => {
            const query = `SELECT genre, original_title
            FROM movie_genres JOIN movies ON movies.id = movie_genres.movie_id
            JOIN genres ON genres.id = movie_genres.genre_id
			WHERE genre = 'Horror'
            `;
            const result = await db.selectSingleRow(query);

            expect(result).toEqual({
                genre: "Horror",
                original_title: 'Goosebumps'
            });

            done();
        },
        minutes(3)
    );
    it(
        "should select production company by most movies",
        async done => {
            const query = `SELECT COUNT(original_title) AS count, company_name AS company
            FROM movie_production_companies JOIN movies ON movies.id = movie_production_companies.movie_id
            JOIN production_companies ON production_companies.id = movie_production_companies.company_id
            GROUP BY company
            ORDER BY count DESC
            LIMIT 1;
            `;
            const result = await db.selectSingleRow(query);

            expect(result).toEqual({
                company: 'Universal Pictures',
                count: 520
            });

            done();
        },
        minutes(3)
    );
});
