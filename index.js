let express = require('express');
let app = express();
let ejs = require('ejs');

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Listening at port 3000')
});