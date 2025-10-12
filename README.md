# Library Management App

This web application allows users to register, log in, search for books on OpenLibrary, add to wishlist, borrow books, and manage their profile. It uses React with TypeScript, Context API for global state, and localStorage for data persistence (users, loans, wishlist). No real backend is required; everything is simulated locally.

## Installation and Execution

* Install dependencies: `npm install`
* Run in development: `npm start`
* Build for production: `npm run build`

## Main Features

* **Book Search**: Integrates with OpenLibrary's public API to search and display book details.
* **Wishlist and Loan Management**: Add books to wishlist or loans, with localStorage persistence.
* **User Profile**: Displays logged-in user info and allows logout.
* **Authentication**: Complete flow based on simulated tokens (see section below).

## Authentication Flow

Authentication is simulated using localStorage to store users and tokens, without a real backend. The flow is as follows:

* **Registration**: Creates a new user with username and password, saves it to localStorage (array of users). Does not generate a token at this step.
* **Login**: Verifies credentials against stored users. If valid, generates a simple token (base64 of `username:password` to simulate JWT), stores it in localStorage under the key `lib_auth_token`, and saves the current user under `current_user`. Returns the logged-in user.
* **Current User**: `getCurrentUser` first verifies the token's existence; if there isn't one, returns null (no user). If there is a token, loads the user from localStorage.
* **Logout**: Removes the current user and token from localStorage, resetting the auth state.
* **"Backend" Integration**: A service (`authTokenService`) handles the token and generates authorization headers (`Authorization: Bearer <token>`). In operations like loans, the token is checked before proceeding (simulating a protected API call), but persistence continues in localStorage without changes. This prepares the app for a real backend in the future, without altering current functionality.

The token ensures that only authenticated users access protected features, maintaining simplicity and compatibility with existing local persistence. For production, replace the simulation with a real JWT backend (e.g. Node.js/Express).

## Running Tests with Jest (React + TypeScript)

This project uses Jest and React Testing Library for unit testing. Below is an explanation of how to run tests, view coverage, and troubleshoot common errors.

### 1. Install dependencies (if you haven't already)

```bash
npm install
```

### 2. Run all tests

```bash
npm test
```

I decided to use the capstone for the simple reason of also advancing in filters.