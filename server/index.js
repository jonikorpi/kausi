const app = require('./server');

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`);
});
