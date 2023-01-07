if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const connectionString = process.env.DB_URL;
const User = require('./models/userModel.js')
const { Collection } = require("discord.js");
//---//
const Discord = require('discord.js');
const client = new Discord.Client();

let results = '';

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
const prefix = '//';

client.once('ready',() =>{
    console.log('final bot online')
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command == 'up'){
        message.guild.members.fetch().then(m => {
            let usernames = m.map(u => u.user.username);
    
            //let roleNumbers = m.map(u => u.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.toString()));
    
            let roleNames = m.map(u => u.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.name));

            for(let i=0; i< usernames.length; i++){ 
                const user = new User({
                    usernames: usernames[i].toString(),
                    roleNames: roleNames[i].toString()
                });
    
                User.find({usernames: usernames[i].toString()}).then(result =>{
                    if(result.length == 0){
                        
                        user.save()
                            .then(result =>{/*console.log(result)*/})
                            .catch(err =>{console.error(err);});
    
                    }});
          }
            message.channel.send('uploaded ');
        }); //end message fetch 
    }else{if(command == 'use'){
        
        User.find().select({_id: 0, usernames: 1}).then(result =>{
            //console.log(result);
            if(result.length > 0){
                for(let i = 0; result.length > i; i++){
                    results += result[i].usernames + '\n';
                }
                message.channel.send(results);
            }else{message.channel.send('files not founded');}
        });
    }else{if(command == 'd'){
        User.deleteMany().then(message.channel.send('deleted User'));
    }}}
}); 

client.login(process.env.TOKEN);

// User.find().select({_id: 0, usernames: 1}).then(result =>{
//     //console.log(result);
//     if(result.length > 0){
//         for(let i = 0; result.length > i; i++){
//             results += result[i].usernames + '\n';
//         }
//     }
// });
//de la manera de arriba se obtiene (en este caso) el username de cada usuario, puede ser cualquier valor que tenga el model