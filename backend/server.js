import { ApolloServer, gql } from "apollo-server";

const users = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe"
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "Doe"
    },
];

const typeDefs = gql`
    type User {
        id: ID! # required field
        firstName: String! # required field
        lastName: String! # required field
        fullName: String! # custom field
    }

    type Query {    
        allUsers: [User!]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!): User!
        deleteUser(id: ID!): User
    }
`;

const resolvers = {
    Query: {
        allUsers() {
            return users;
        },
    },

    Mutation: {
        createUser(_, { firstName, lastName }) {
            const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1; // Calculate new ID
            const newUser = {
                id: newId,
                firstName,
                lastName
            };
            users.push(newUser);
            return newUser;
        },

        deleteUser(_, { id }) {
            const userIndex = users.findIndex((user) => user.id === parseInt(id, 10));
            if (userIndex === -1) {
                throw new Error(`User with id ${id} not found`);
            }
            const [deletedUser] = users.splice(userIndex, 1); // Remove user from the array
            return deletedUser; // Return the deleted user
        },
    },

    User: {
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});