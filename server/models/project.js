const mongoose = require('mongoose')

const project= new mongoose.Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    status:{
        type: String,
        enum:['not Started','In progress', 'completed']
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client'
    }
})

module.exports= mongoose.model('project',project)