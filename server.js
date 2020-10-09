const express = require('express')
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()
const port = 3000

// Sample Data
const authors = [
	{ id: 1, name: 'Dan Brown' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'The Lost Symbol', authorId: 1 },
	{ id: 2, name: 'Angels and Demons', authorId: 1 },
	{ id: 3, name: 'The Davinci Code', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType, // AuthorType is defined below the same way that BookType is defined above
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents the author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType
})



app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))


app.get('/', (req, res) => {
  res.send(`<a href="http://localhost:${port}/graphql">GraphiQL</a>`)
})

// QUERY:
// 
// {
// 	books {
//     id
//   	name
//     author {
//       name
//     }
// 	}
// }

// RESULT
// 
// {
//   "data": {
//     "books": [
//       {
//         "id": 1,
//         "name": "The Lost Symbol",
//         "author": {
//           "name": "Dan Brown"
//         }
//       },
//       {
//         "id": 2,
//         "name": "Angels and Demons",
//         "author": {
//           "name": "Dan Brown"
//         }
//       }, //...
//     ]
//   }
// }

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`)
});