let express = require('express');
let app = express();
let ejs = require('ejs');
let ejsMate = require('ejs-mate');
let { currentUsers } = require('./seeds/usuarios');
let { roles } = require('./seeds/roles');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', async (req, res) => {
  res.render('contact', { currentUsers });
});

app.get('/lore', (req, res) => {
  res.render('lore', { roles });
});

app.listen(3000, () => {
  console.log('Listening at port 3000');
});
