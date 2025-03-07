const express = require("express");
const app = express();
const port = 3000;

app.get("/movies", (req, res) => {
  res.send(moviesData);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
