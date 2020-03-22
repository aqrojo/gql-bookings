const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const eventList = [
  'Estudiar graphql',
  'Jugar a guildWars',
  'Hacer pollo asado'
];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
   type rootQuery {
    events: [String!]!
   }
   
   type rootMutation {
    createEvent(name: String!): String
   } 
   
   schema {
    query: rootQuery
    mutation: rootMutation
   }
  `),
  rootValue: {
   events: () => eventList,
   createEvent: (args) => eventList.push(args.name) && args.name
  },
  graphiql: true
}));

app.listen(3000, () => console.log('start server'));
