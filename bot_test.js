if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const { Collection } = require("discord.js");
//---//
const Discord = require('discord.js');
const client = new Discord.Client();
let count = 0;
let results = '';
const prefix = '//';
// ---


function guildUp(name){
    const Guild = client.guilds.cache.get('1058504488773746760');
    Guild.members.fetch().then(members =>
        {
            Guild.members.fetch().then(m => {
                let usernames = m.map(u => u.user.username);
                let color = m.map(u => u.displayHexColor);
                let roleNames = m.map(u => u.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.name));
                name.channel.send(usernames); // aca iria  la subida de datos 
            });
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
    }

});

client.login(process.env.TOKEN);