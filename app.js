const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const EventModel = require('./models/Event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
   type Event {
    _id: ID
    title: String!
    description: String!
    price: Float!
    date: String!
   }
   
   input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
   }
   
   type rootQuery {
    events: [Event!]!
   }
   
   type rootMutation {
    createEvent(eventInput: EventInput ): Event
   } 
   
   schema {
    query: rootQuery
    mutation: rootMutation
   }
  `),

  rootValue: {
    events: () => {
      return EventModel
        .find()
        .then(result => {
          console.log('result success', result);
          return result
        })
        .catch(err => { throw err;});
    },

    createEvent: (args) => {
      return new EventModel({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
      })
        .save()
        .then(result => ({
          ...result._doc,
          _id: result.id,
        }))
        .catch(err => {throw err;});
    },
  },
  graphiql: true,
}));

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-iivao.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
  .then(() => app.listen(3000, () => console.log('start server')))
  .catch(err => console.log('error trying to connect db', err));


