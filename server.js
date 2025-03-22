const express = require("express");
const { writeFile } = require("fs");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const port = 9090;

app.use(express.json()); // <--- need this to access request body

app.get("/movies", async (req, res) => {
  let movies = await readMovies();
  res.status(200).send(movies);
});

app.get("/movies/:id", async (req, res) => {
  const idToFind = Number(req.params.id);
  let movies = await readMovies();
  const movie = movies.find((movie) => movie.id === idToFind);
  console.log(movie);
  res.status(200).send(movie);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my movie API!!!");
});

app.post("/movies", async (req, res) => {
  console.log(req.body, "<---- this is the data the client is sent over!");
  const newMovie = req.body;
  let movies = await readMovies();
  movies.push(newMovie);
  await storeMovies(movies);
  res.status(201).send(newMovie);
});

// Deletes movie
app.delete("/movies/:id", async (req, res) => {
  const idToFind = Number(req.params.id);
  let movies = await readMovies();
  const updatedMovies = movies.filter((movie) => movie.id !== idToFind);
  await storeMovies(updatedMovies);

  // answer 204 - No content
  res.status(200).send(updatedMovies);
});

// PUT
app.put("/movies/:id", async (req, res) => {
  console.log("hitting the put endpoint...");
  console.log("req.params", req.params);
  console.log("req.body", req.body);

  const newMovie = { ...req.body, ...req.params };
  const idToFind = Number(req.params.id);
  let movies = await readMovies();
  const movieIndex = movies.findIndex((movie) => movie.id === idToFind);
  movies.splice(movieIndex, 1, newMovie);

  res.status(200).send({ success: true });
});

let readMovies = async () => {
  let movies = await fs.readFile(
    path.join(__dirname, "data", "movies.json"),
    "utf-8"
  );
  return JSON.parse(movies);
};

// updates movies.json
let storeMovies = async (movies) => {
  await fs.writeFile(
    path.join(__dirname, "data", "movies.json"),
    JSON.stringify(movies, null, 2)
  );
};

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
