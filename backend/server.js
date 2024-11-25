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

            console.log('Stored password hash:', user.password);
            console.log('Provided password:', password);

            // Trim the provided password
            const trimmedPassword = password.trim();
            console.log('Trimmed provided password:', trimmedPassword);

            const valid = await bcrypt.compare(trimmedPassword, user.password);
            console.log('Password valid:', valid);

            if (!valid) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
            return { token };
        },
        register: async (_, { username, password }) => {
            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            // Check if user already exists
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // Hash the password explicitly
            const trimmedPassword = password.trim();
            const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
            console.log('Original password:', password);
            console.log('Trimmed password:', trimmedPassword);
            console.log('Hashed password:', hashedPassword);

            // Save user with hashed password
            const user = new User({ username, password: hashedPassword });
            await user.save();
            console.log('User saved to database:', user);

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
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