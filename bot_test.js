if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const { Collection } = require("discord.js");
//---//

const mongoose = require('mongoose');
const connectionString = process.env.DB_URL;
const User = require('./models/userModel')

const Discord = require('discord.js');
const client = new Discord.Client();
let count = 0;
let results = '';
const prefix = '//';


// ---

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

function guildUp(name){
    const Guild = client.guilds.cache.get('1058504488773746760');
    Guild.members.fetch().then(members =>
        {
            Guild.members.fetch().then(m => {
                let count = 0;
                let usernames = m.map(u => u.user.username);
                let color = m.map(u => u.displayHexColor);
                let roleNames = m.map(u => u.roles.cache.filter((roles) => roles.id !== Guild.id).map((role) => role.name));
                
                for(let i = 0; i< usernames.length;i++ )
                {
                    //name.channel.send(usernames[i] + ' is ' + roleNames[i] + ' with color  ' + color[i]); // aca iria  la subida de datos 
                    const user = new User({
                        userNames: usernames[i].toString(),
                        roleNames: roleNames[i].toString(),
                        color: color[i].toString()
                    });
                    
                    User.find({userNames: usernames[i].toString()}).then(result =>{
                        
                        if(result.length < 1){
                            
                            user.save()
                                .then(result =>{/*console.log(result)*/})
                                .catch(err =>{console.error(err);});
                                 count++;
                        }});
                }
                name.channel.send('uploaded ' + count + ' users');
            });
        });
}

function guildDown(message){
    let results = '';
      User.find().select({_id: 0, userNames: 1, color:1}).then(result =>{
        if(result.length > 0){
          for(let i = 0; result.length > i; i++){
              results += result[i].userNames + ' ' + result[i].color + '\n';
              console.log(results) 
          } message.channel.send(results);
        }else{message.channel.send('files not founded');}
      });
}



client.once('ready',() =>{
  console.log('test bot online')
});
client.on('message', message =>{
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

    if(command == 'up'){
        guildUp(message);
    }else{
        if(command == 'use'){
            guildDown(message);
        }else{
            if(command == 'd'){
                User.deleteMany().then(message.channel.send('deleted User'));
            }
        }
    }

});

client.login(process.env.TOKEN);