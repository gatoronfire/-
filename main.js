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
            count =0;
            let usernames = m.map(u => u.user.username);
    
            //let roleNumbers = m.map(u => u.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.toString()));
            //let isAdmin = message.member.permissions.has((1 << 3));
            let color = m.map(u => u.displayHexColor);
            
            let roleNames = m.map(u => u.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.name));

            for(let i=0; i< usernames.length; i++){ 
                const user = new User({
                    usernames: usernames[i].toString(),
                    roleNames: roleNames[i].toString(),
                    color: color[i].toString()
                });
                
                User.find({usernames: usernames[i].toString()}).then(result =>{
                    
                    if(result.length < 1){
                        
                        user.save()
                            .then(result =>{/*console.log(result)*/})
                            .catch(err =>{console.error(err);});
                             count++;
                    }});
                   
          }
            message.channel.send('uploaded ' + count + ' users');
        }); //end message fetch 
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