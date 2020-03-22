const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const events = [];

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
    events: () => events,
    createEvent: (args) =>
      events.push({
        _id: Date.now().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
      }) && events[events.length - 1],
  },
  graphiql: true,
}));

// escribo otra cosa

app.listen(3000, () => console.log('start server'));
