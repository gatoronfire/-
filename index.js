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
  res.render('contact', { currentUsers });
});

app.get('/lore', (req, res) => {
  res.render('lore', { roles });
});

app.listen(3000, () => {
  console.log('Listening at port 3000');
});

function loginDB(){
  const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/thebluehell';
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

mongoose.connect(connectionString,{
  useNewURLParser: true,
  useUnifiedTopology:true,
  useFindAndModify:false,
  useCretorIndex:true
})
.then(()=> {
  console.log('conectado a la base de datos');
}).catch(err => {console.error(err)});
}
loginDB();

client.once('ready',() =>{
  console.log('final bot online')
});

client.on('message', message =>{
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(command == 'up'){
       //end message fetch 
  }else{if(command == 'use'){
      results = '';
      User.find().select({_id: 0, usernames: 1, color:1}).then(result =>{
          //console.log(result);
          if(result.length > 0){
              for(let i = 0; result.length > i; i++){
                  //results += result[i].usernames + ' ' + result[i].color + '\n';
                  const newEmbed = new Discord.MessageEmbed()
                  .setColor(result[i].color)
                  .addFields({name: result[i].usernames.toString()});
                  message.channel.send(newEmbed);
              }
              //const guild =  client.guilds.fetch(guildId);
              //message.channel.send(guild);
              
          }else{message.channel.send('files not founded');}
      });
  }else{if(command == 'd'){
      User.deleteMany().then(message.channel.send('deleted User'));
  }}}
}); 

client.login(process.env.TOKEN);
