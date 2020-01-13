const functions = require('firebase-functions');
const app = require('./code/app');

const port = 3000;

app.listen(port, () => {
  console.log(`Ouvindo porta ${port}`);
});

const server = functions.https.onRequest(app);

module.exports = {
  server
};
