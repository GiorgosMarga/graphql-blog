const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
  }
  type Mutation {
    createUser(email: String!, password: String!, username: String!): User
    login(email: String!, password: String!): User
    createPost(text: String, title: String): Post
    deletePost(postId: ID!): Post
    updatePost(postId: ID!, text: String, title: String): Post
  }

  type User {
    id: ID!
    email: String!
    password: String!
    username: String!
    image: String
    token: String!
    posts: [Post]
  }
  type Post {
    id: ID!
    userId: ID!
    text: String!
    title: String!
  }
`;

module.exports = typeDefs;
