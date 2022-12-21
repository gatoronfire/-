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

app.listen(3000, () => {
  console.log('Listening at port 3000')
});