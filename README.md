# Webby - Assessment

A GraphQL API built with NestJS, Prisma, and TypeScript.

## 📌 Features

### 👤 Account Management
- Register with email, username, and password
- Login with token-based authentication (JWT)
- View and update profile

### 📝 Post Management (requires authentication)
- Create posts with one or more tags
- View own posts
- Update/delete own posts

### 🏷️ Tag Management
- Public access to create and list tags
- Tags can be reused across multiple posts

## 🔧 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **API:** GraphQL (Code-First)
- **ORM:** Prisma
- **DB:** SQLite
- **Validation:** class-validator
- **Architecture:** CQRS (Command Query Responsibility Segregation)

## 🛠️ Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run setup script
# This will generate local environment variables, do prisma migrations and seed the database
npm run setup

# 3. Start the development server
npm run start:dev
```
## 🚀 Running the API

- Local server will be available at http://localhost:3000/graphql

- Use the GraphQL Playground to test queries and mutations

## 🎯 GraphQL Queries & Mutations

### 👤 Authentication & User

#### 📝 Register a new user (Only unauthenticated)

```graphql
mutation {
  createUser(createUserInput: {
    username: "johndoe123"
    email: "john@example.com"
    password: "StrongPass123!"
    bio: "I'm a developer."
    avatar: "https://example.com/avatar.png"
  }) {
    id
    username
    email
  }
}
```
#### 🔑 Sign in

```graphql
mutation {
  signInUser(signInInput: {
    username: "johndoe123"
    password: "StrongPass123!"
  }) {
    token
    expiresAt
  }
}
```
#### 👤 Get current user
```graphql
query {
  me {
    id
    username
    email
    profile {
      bio
      avatar
    }
  }
}
```

#### ✏️ Update profile
```graphql
mutation {
  updateUser(updateUserInput: {
    bio: "Updated bio"
    avatar: "https://example.com/new-avatar.png"
  }) {
    id
    profile {
      bio
      avatar
    }
  }
}
```

### 📝 Posts
#### ➕ Create a post
```graphql
mutation {
  createPost(createPostInput: {
    title: "GraphQL with NestJS"
    content: "This is a great post about GraphQL and NestJS!"
  }) {
    id
    title
    content
    createdAt
  }
}
```

#### 🔄 Update a post
```graphql
mutation {
  updatePost(updatePostInput: {
    id: "postId123"
    title: "Updated Title"
    content: "Updated Content"
  }) {
    id
    title
    content
  }
}
```

#### ❌ Delete a post
```graphql
mutation {
  removePost(removePostInput: {
    id: "postId123"
  }) {
    id
    title
  }
}
```

#### 📋 Get all posts (with optional filters)
```graphql
query {
  posts(findAllPostInput: {
    searchText: "GraphQL"
    tagId: 1
    authorId: "userId123"
  }) {
    posts {
      id
      title
      tags {
        name
      }
      author {
        username
      }
    }
    nextCursor
  }
}
```

#### 🔍 Get post by ID
```graphql
query {
  post(id: "postId123") {
    title
    content
    author {
      username
    }
  }
}
```

### 🏷️ Tags
#### ➕ Create tag
```graphql
mutation {
  createTag(createTagInput: {
    name: "nestjs"
  }) {
    id
    name
  }
}
```

#### 📋 Get all tags (Unauthenticated)
```graphql
query {
  tags {
    id
    name
  }
}
``` 

#### 🔗 Assign tag to post
```graphql
mutation {
  assignTag(assignTagInput: {
    id: "postId123"
    tagId: 1
  }) {
    id
    tags {
      name
    }
  }
}
```

#### ❌ Remove tag from post
```graphql
mutation {
  removeTag(removeTagInput: {
    id: "postId123"
    tagId: 1
  }) {
    id
    tags {
      name
    }
  }
}
```

## Known Issues

### 🧠 Learning and Applying CQRS

- **Challenge**: I had no prior experience with CQRS, and applying it in a NestJS GraphQL project was initially unfamiliar.

- **What I Did**:

  - Watched videos and read articles to understand CQRS concepts.

  - Studied real-world GitHub repos to see how CQRS is structured in NestJS apps.

- **Solution**:

  - Separated commands (writes) and queries (reads) using the @nestjs/cqrs module.

  - Kept resolvers lean by delegating logic to command/query handlers.

  - This improved modularity and made the code easier to test and maintain.

### 🛠️ Database Setup Simplification

- **Challenge**: I initially used MySQL and PostgreSQL for the database, but found it difficult to set up and manage.

- **What I Did**:

  - I switched to SQLite, a serverless, file-based database that integrates smoothly with Prisma.

  - The Prisma schema can be easily switched to MySQL or PostgreSQL later with minimal changes if needed.
