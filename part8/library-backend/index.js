require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const { PubSub } = require('graphql-subscriptions')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// Initial data for seeding the database if needed
const seedData = async () => {
  const authorCount = await Author.countDocuments()
  const bookCount = await Book.countDocuments()
  
  if (authorCount === 0 && bookCount === 0) {
    console.log('Seeding initial data...')
    
    // Create authors
    const robert = new Author({ name: 'Robert Martin', born: 1952 })
    const martin = new Author({ name: 'Martin Fowler', born: 1963 })
    const fyodor = new Author({ name: 'Fyodor Dostoevsky', born: 1821 })
    const joshua = new Author({ name: 'Joshua Kerievsky' })
    const sandi = new Author({ name: 'Sandi Metz' })
    
    await robert.save()
    await martin.save()
    await fyodor.save()
    await joshua.save()
    await sandi.save()
    
    // Create books
    const books = [
      { title: 'Clean Code', published: 2008, author: robert._id, genres: ['refactoring'] },
      { title: 'Agile software development', published: 2002, author: robert._id, genres: ['agile', 'patterns', 'design'] },
      { title: 'Refactoring, edition 2', published: 2018, author: martin._id, genres: ['refactoring'] },
      { title: 'Refactoring to patterns', published: 2008, author: joshua._id, genres: ['refactoring', 'patterns'] },
      { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: sandi._id, genres: ['refactoring', 'design'] },
      { title: 'Crime and punishment', published: 1866, author: fyodor._id, genres: ['classic', 'crime'] },
      { title: 'Demons', published: 1872, author: fyodor._id, genres: ['classic', 'revolution'] }
    ]
    
    for (const bookData of books) {
      const book = new Book(bookData)
      await book.save()
    }
    
    console.log('Initial data seeded successfully')
  }
}

// Call seed function after connection
mongoose.connection.once('open', seedData)

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    
    allBooks: async (root, args) => {
      let filter = {}
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }
      
      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }
      
      return await Book.find(filter).populate('author')
    },
    
    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$books' }
          }
        },
        {
          $project: {
            name: 1,
            born: 1,
            bookCount: 1
          }
        }
      ])
      return authors
    },

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      return root.bookCount !== undefined ? root.bookCount : await Book.collection.countDocuments({ author: root._id })
    }
  },
  
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      try {
        // Find or create author
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        
        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres
        })
        
        await book.save()
        await book.populate('author')
        
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        
        return book
      } catch (error) {
        throw new GraphQLError('Creating book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true, runValidators: true }
        )
        return author
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },

    createUser: async (root, args) => {
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre
        })

        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

// Create the schema
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Create an Express app and HTTP server
const app = express()
const httpServer = http.createServer(app)

// Create our WebSocket server using the HTTP server we just set up
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
})

// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer)

// Set up ApolloServer
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
})

const startServer = async () => {
  await server.start()
  
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            return {}
          }
        }
        return {}
      },
    }),
  )

  const PORT = 4000
  
  // Now that our HTTP server is fully set up, we can listen to it
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  })
}

startServer().catch((error) => {
  console.error('Error starting server:', error)
})
