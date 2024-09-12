# Notepad App

## Description

The **Notepad App** is a web-based application that allows users to register, log in, and create, view, update, and delete notes. Users can organize their notes and access them from anywhere after securely logging into their accounts. The app provides a simple yet effective interface for note-taking and offers markdown support for better formatting. The application is built with a focus on user authentication and ensures secure storage of notes with each user having their own personalized set of notes.

## Features

- **User Registration**: Users can create accounts with their email, username, and password.
- **User Login**: Users can log in using their email and password to access their notes.
- **Create Notes**: Authenticated users can create new notes with a title and content.
- **View Notes**: Users can view all their saved notes, organized by title.
- **Update Notes**: Users can edit the title and content of their existing notes.
- **Delete Notes**: Users can permanently delete notes they no longer need.
- **Markdown Support**: Users can format their notes using markdown for better readability.
- **Authentication**: The app uses JSON Web Tokens (JWT) to manage user sessions securely.

## Tech Stack

### Backend
- **Node.js**: The app's backend is built using Node.js with the Express framework.
- **PostgreSQL**: A relational database is used to store user credentials and notes.
- **JWT Authentication**: JSON Web Tokens are used for secure user authentication.
- **Bcrypt**: Used to securely hash user passwords before storing them in the database.
- **pg**: PostgreSQL Node.js client for connecting and interacting with the PostgreSQL database.

### Frontend
- **React**: The frontend of the app is built using React, providing a dynamic and interactive user interface.
- **React Router**: Used to handle routing and navigation between different pages of the app.
- **Axios**: Used to make HTTP requests from the frontend to the backend API.
- **Markdown-it**: For markdown parsing in the note editor.
- **React Markdown Editor Lite**: A simple and lightweight markdown editor for note creation.

## How It Works

### User Workflow

1. **Sign Up**: New users can sign up by providing their email, username, and password. The password is hashed before being stored in the database.
2. **Log In**: After signing up, users can log in with their email and password. Upon successful login, a JWT token is generated and stored in the browser's local storage to manage their session.
3. **Creating Notes**: Once authenticated, users can create a new note by providing a title and content. Notes are saved in the database and associated with the logged-in user's account.
4. **Viewing and Editing Notes**: Users can view a list of their notes in the sidebar and click on a note to view or edit its content.
5. **Deleting Notes**: Users can also delete notes, which will permanently remove them from the database.
6. **Logging Out**: The user’s session is managed by JWT, which expires after a set time. Users can log out by simply removing the token from local storage.

### Database Structure

#### Tables:

- **users**
  - `id`: Primary key, unique identifier for each user.
  - `email`: Unique email address for each user.
  - `username`: Unique username for each user.
  - `password`: Hashed password for secure login.

- **notes**
  - `id`: Primary key, unique identifier for each note.
  - `user_id`: Foreign key linking the note to the user who created it.
  - `title`: Title of the note.
  - `content`: Content of the note, supports markdown formatting.
  - `date`: Timestamp of when the note was created.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v12.x or higher)
- **PostgreSQL** (v12.x or higher)