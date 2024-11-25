import { ApolloServer, gql } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
});

// GraphQL Type Definitions
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        password: String! # Hashed password
    }

    type Token {
        token: String!
    }

    type Query {
        allUsers: [User!]!
    }

    type Mutation {
        login(username: String!, password: String!): Token!
        register(username: String!, password: String!): Token!
    }
`;

// Mongoose Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Middleware to prevent double hashing
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        if (!this.password.startsWith('$2a$')) { // Only hash if not already hashed
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

// GraphQL Resolvers
const resolvers = {
    Query: {
        allUsers: async () => {
            const users = await User.find();
            return users;
        },
    },
    Mutation: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            const valid = await bcrypt.compare(password.trim(), user.password);
            if (!valid) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            return { token };
        },
        register: async (_, { username, password }) => {
            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw new Error('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(password.trim(), 10);
            const user = new User({ username, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            return { token };
        },
    },
};

// Start Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});