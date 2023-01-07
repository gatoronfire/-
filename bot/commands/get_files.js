const mongoose = require('mongoose');
const {model, Schema} = mongoose; 
const User = require('../models/userModel.js')
const connectionString = process.env.DB_URL;

/*const getFiles = async ( client, message, args)  =>{
    await User.find({}).then(result =>{
        console.dir(result);
        //message.channel.send(result);
        mongoose.connection.close();
    });
}*/

module.exports = //funcion para iniciar
{
    
    name: 'users',  //nombre (no, no te jodo)
    aliases: ['use'],
    description: 'get files from mongoose database', //descripcion
    execute( client, message, args)
    {
        //aca va el codigo a ejecutar
        mongoose.connect(connectionString,{
            useNewURLParser: true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCretorIndex:true
        });

    

        User.find({}).then(result =>{
            //console.log(result);
            if(result.length > 0){
                message.channel.send(result);
            }else{message.channel.send('files not founded');}
        });
    }
}

// problemas de conexion
// los archivos se guardan mal o no se borran