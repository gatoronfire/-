if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const connectionString = process.env.DB_URL;


const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

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

mongoose.connection.once('open', () => {
    console.log('Database connected')});


client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_hand', 'event_hnd'].forEach(handler =>{
        require(`./handlers/${handler}`)(client, Discord);
})

   

client.login(process.env.TOKEN);

//para seguir deberiamos aplicar este video:
//https://www.youtube.com/watch?v=Sihf7B8D4Y8&list=RDCMUC08G-UJT58SbkdmcOYyOQVw&index=24&ab_channel=CodeLyon

