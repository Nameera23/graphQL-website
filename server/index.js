const express = require('express')
require('dotenv').config()
const color = require('colors')
const {graphqlHTTP}= require('express-graphql')
const schema= require('./schema/schema')
const connectDb = require('./config/db')
const app = express()


connectDb()
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV ==='development'
}))

app.listen(process.env.PORT, console.log("server running on port"))