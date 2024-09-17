# Notepad Application

## Overview

This Notepad application is designed for users to create, update, and manage personal notes. It provides an easy-to-use interface, strong user authentication, and an emphasis on security as a core feature. Users can sign up, log in, and securely store their notes, which are linked to their personal accounts.

## Features

- **User Authentication**: Secure user registration and login using hashed passwords (bcrypt) and JWT tokens.
- **Create, Read, Update, and Delete (CRUD) Notes**: Users can create, edit, view, and delete their personal notes.
- **Markdown Support**: Supports markdown formatting for note content, allowing users to format text.
- **Enhanced Security**: The app places a strong emphasis on security, incorporating various measures to protect user data.

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Sequelize ORM.
- **Frontend**: React, Axios, React Router.
- **Security Features**: Helmet, express-rate-limit, bcryptjs, JWT (JSON Web Tokens).

## Security Features (Big Focus)

### 1. **Helmet Middleware for Securing HTTP Headers**

The application uses [Helmet](https://github.com/helmetjs/helmet) to enhance security by setting a variety of HTTP headers that protect the app from common web vulnerabilities such as cross-site scripting (XSS), clickjacking, and other attacks.

- **XSS Protection**: Helmet enables X-XSS-Protection, which helps prevent XSS attacks by sanitizing the browser's response.
- **Content Security Policy**: You can customize Helmet’s Content Security Policy (CSP) to prevent unauthorized scripts from running on your site.
- **Strict Transport Security**: Helmet enforces HSTS headers to ensure the app is only accessible over HTTPS.

```javascript
const helmet = require('helmet');
app.use(helmet());

## 2. Rate Limiting with express-rate-limit

The app incorporates rate limiting using [express-rate-limit](https://github.com/nfriedly/express-rate-limit) to mitigate brute force attacks, distributed denial-of-service (DDoS) attacks, and abusive usage. This feature ensures that users can only make a certain number of requests in a defined period.

- **Global Rate Limiting**: Limits the number of requests from each IP address to 100 requests per 15 minutes.
- **Login Protection**: Stricter rate limiting is applied to sensitive routes like `/login` to prevent brute force attacks on user accounts.

## 3. Password Hashing with bcrypt

User passwords are never stored in plain text. The app uses [bcryptjs](https://www.npmjs.com/package/bcryptjs) to securely hash passwords before storing them in the database. This ensures that even if the database is compromised, user passwords remain secure.

## 4. Authentication with JWT (JSON Web Tokens)

User sessions are managed with JWT tokens, which are securely signed using a secret key. JWT tokens are stored client-side and sent with each request to verify the user's identity.

## 5. Environment Variables with dotenv

Sensitive information such as the JWT secret, database credentials, and other configuration settings are stored securely in environment variables using [dotenv](https://www.npmjs.com/package/dotenv). This ensures that these values are not hard-coded into the app's source code.

## 6. CORS (Cross-Origin Resource Sharing)

To ensure that only requests from allowed origins can interact with the API, the app uses the [cors](https://www.npmjs.com/package/cors) middleware, which helps prevent unauthorized cross-origin requests from untrusted sources.

## How It Works

### User Registration & Authentication
Users sign up with a unique email, username, and password. Passwords are hashed before being stored in the PostgreSQL database. Upon logging in, users receive a JWT token, which they can use to authenticate their session.

### Secure Note Management
Each note is tied to a specific user account, ensuring that notes are only accessible to the authenticated user. Notes are stored securely in a PostgreSQL database and can be created, updated, or deleted via the app's interface.

### Security Focus
The app places a strong emphasis on securing user data and limiting access to the API. Security features such as HTTP headers, rate limiting, password hashing, and token-based authentication are integral to the app's design.
