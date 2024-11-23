const request = require('supertest');
const { app } = require('../index.js');
const { getAllMovies, getMovieById } = require('../controllers/index.js');
const http = require('http');

jest.mock('../controllers/index.js', () => ({
  ...jest.requireActual('../controllers/index.js'),
  getAllMovies: jest.fn(),
}));

let server;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe('Controller Function tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return all movies', () => {
    let mockedMovies = [
      {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
      {
        movieId: 2,
        title: 'The Shawshank Redemption',
        genre: 'Drama',
        director: 'Frank Darabont',
      },
      {
        movieId: 3,
        title: 'The Godfather',
        genre: 'Crime',
        director: 'Francis Ford Coppola',
      },
    ];
    getAllMovies.mockReturnValue(mockedMovies);
    let result = getAllMovies();
    expect(result).toEqual(mockedMovies);
    expect(result.length).toBe(3);
  });
});

describe('API Endpoint tests', () => {
  it('GET /movies should get all movies', async () => {
    const result = await request(server).get('/movies');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      movies: [
        {
          movieId: 1,
          title: 'Inception',
          genre: 'Sci-Fi',
          director: 'Christopher Nolan',
        },
        {
          movieId: 2,
          title: 'The Shawshank Redemption',
          genre: 'Drama',
          director: 'Frank Darabont',
        },
        {
          movieId: 3,
          title: 'The Godfather',
          genre: 'Crime',
          director: 'Francis Ford Coppola',
        },
      ],
    });
    expect(result.body.movies.length).toBe(3);
  });
  it('GET /movies/details/:id should get an movie by id', async () => {
    const result = await request(server).get('/movies/details/1');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      movie: {
        movieId: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
      },
    });
  });
});
