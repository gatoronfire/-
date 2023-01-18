let express = require('express');
let app = express();
let ejs = require('ejs');
let ejsMate = require('ejs-mate');
//let { currentUsers } = require('./seeds/usuarios');
let { roles } = require('./seeds/roles');

// ---
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const mongoose = require('mongoose');
const { EmbedBuilder } = require('discord.js');
const connectionString = process.env.DB_URL;
const User = require('./models/userModel')
const { Collection } = require("discord.js");
//---//
const Discord = require('discord.js');
const client = new Discord.Client();
let count = 0;
let results = '';
const prefix = '//';
// ---

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', async (req, res) => {
  const currentUsers = await User.find();
  res.render('contact', { currentUsers });
});

app.get('/lore', (req, res) => {
  res.render('lore', { roles });
});

app.listen(3000, () => {
  console.log('Listening at port 3000');
});

function loginDB() {
  const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/thebluehell';
  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', () => {
    console.log('Database connected');
  });

  mongoose.connect(connectionString, {
    useNewURLParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCretorIndex: true
  })
    .then(() => {
      console.log('conectado a la base de datos');
    }).catch(err => { console.error(err) });
}
loginDB();

client.once('ready', () => {
  console.log('final bot online')
});

async function guildUp(name) {
  const Guild = client.guilds.cache.get('711133085046931498');
  Guild.members.fetch().then(m => {

    let usernames = m.map(u => u.user.username);
    let color = m.map(u => u.displayHexColor);
    let roleNames = m.map(u => u.roles.cache.filter((roles) => roles.id !== Guild.id).map((role) => role.name));
    let status = '';
    let rolesMain = ['Gods', 'Apostol', 'Winged', 'Redskin', 'Scaly', 'Sinner', 'Heretic', 'Rebel'];

    for (let i = 0; i < roleNames.length; i++) {

      for (let j = 0; j < roleNames[i].length; j++) {

        for (let k = 0; k < rolesMain.length; k++) {

          if (roleNames[i][j] === rolesMain[k]) {
            console.log(rolesMain[k] + ' ' + usernames[i])
          }
        }
      }
    }

    for (let i = 0; i < usernames.length; i++) {
      const user = new User({
        userNames: usernames[i].toString(),
        roleNames: roleNames[i].toString(),
        color: color[i].toString(),
        status: status
      });

      User.find({ userNames: usernames[i].toString() }).then(result => {

        if (result.length == 0) {
          user.save()
            .then(result => {/*console.log(result)*/ })
            .catch(err => { console.error(err); });
          count++;
          // console.log(count + ' of 3');
          if (i == usernames.length - 1) {
            if (count != 0) { name.channel.send('uploaded ' + count + ' users'); }
          }
        } else {
          i = usernames.length;
        }
      });

    }
  });
  count = 0;
}

function guildDown(message) {
  let results = '';
  User.find().select({ _id: 0, userNames: 1, color: 1 }).then(result => {
    if (result.length > 0) {
      for (let i = 0; result.length > i; i++) {
        results += result[i].userNames + ' ' + result[i].color + '\n';
      } message.channel.send(results);
    } else { message.channel.send('files not founded'); }
  });
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command == 'up') {
    guildUp(message);
  } else {
    if (command == 'use') {
      guildDown(message);
    } else {
      if (command == 'd') {
        User.deleteMany().then(message.channel.send('deleted User'));
      }
    }
  }

});

client.login(process.env.TOKEN);