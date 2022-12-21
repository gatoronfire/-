let express = require('express');
let app = express();
let ejs = require('ejs');
let ejsMate = require('ejs-mate')

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

<<<<<<< HEAD
app.get('/location', (req, res) => {
  res.render('location');
});

=======
>>>>>>> fa702b4544d1357cdc59b2bf4112957687a35075
app.listen(3000, () => {
  console.log('Listening at port 3000')
});