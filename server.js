const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', text => {
  return text.toUpperCase();
});
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const { method, url } = req;
  const now = new Date().toString();
  const log = `${now} ${method} ${url}`;

  console.log(`${now} ${method} ${url}`);

  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to file.');
    }
  });

  next();
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  // res.send('<h1>Welcome to the app</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the website!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Us Page',
    templateText: 'This is some template text'
  });
});

app.get('/bad', (req, res) => {
  res.status(400).send({
    error: 'Error handling request',
    errorStatus: 404
  });
});

app.listen(PORT, () =>
  console.log(`Server listening for requests on port:${PORT}...`)
);
