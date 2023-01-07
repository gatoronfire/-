const { Collection } = require("discord.js");
const mongoose = require('mongoose');
const User = require('../models/userModel.js')
const connectionString = process.env.DB_URL;
module.exports = //funcion para iniciar
{
    name: 'delete',  //nombre (no, no te jodo)
    aliases: ['d'],
    description: 'delete User', //descripcion
    execute( client, message, args)
    {
        mongoose.connect(connectionString,{
            useNewURLParser: true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCretorIndex:true
        });

        User.remove().then(message.channel.send('deleted User'));

    }
}