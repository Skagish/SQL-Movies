export const selectActorByName = (fullName: string): string => {
  return (`Select full_name FROM actors WHERE full_name IN (${fullName})`)
};

export const selectKeyword = (keyword: string): string => {
  return (`Select keyword FROM keywords WHERE keyword IN (${keyword})`)
};

export const selectDirector = (director: string): string => {
  return (`Select full_name FROM directors WHERE full_name IN (${director})`)
};

export const selectGenre = (genre: string): string => {
  return (`Select genre FROM genres WHERE genre IN (${genre})`)
};

export const selectProductionCompany = (company: string): string => {
  return (`Select company_name FROM production_companies WHERE company_name IN (${company})`)
};

export const selectMovie = (imdbId: string): string => {
  return (`Select imdb_id FROM movies WHERE imdb_id IN (${imdbId})`)
};

export const selectMovieId = (imdbId: string): string => {
  return (`Select id FROM movies WHERE imdb_id IN (${imdbId})`)
};

export const selectRatingsByUserID = (userId: number): string => {
  return (`Select rating FROM movie_ratings WHERE user_id IN (${userId})`)
};

/**
 * select count as c, because an object is returned and expected property name is c
*/
export const selectCount = (table: string): string => {
  return (`SELECT COUNT(*) AS c
  FROM ${table}`);
};
