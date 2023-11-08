const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { csrfSync } = require("csrf-sync");
const session = require('express-session');

const {
    invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to generate, store, and get a CSRF token.
    getTokenFromRequest, // use this to retrieve the token submitted by a user
    getTokenFromState, // The default method for retrieving a token from state.
    storeTokenInState, // The default method for storing a token in state.
    revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
    csrfSynchronisedProtection, // This is the default CSRF protection middleware.
  } = csrfSync();

const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

app = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

app.use(session);

const myRoute = (req, res) => res.json({ token: generateToken(req) });
app.get("/csrf-token", myRoute);

app.use(csrfSynchronisedProtection);

const myCsrfProtectionMiddleware = (req, res, next) => {
    // Some method to determine whether we want CSRF protection to apply
    if (isCsrfProtectionNeeded(req)) {
      // protect with CSRF
      csrfSynchronisedProtection(req, res, next);
    } else {
      // Don't protect with CSRF
      next();
    }
  };
  app.use(myCsrfProtectionMiddleware);

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  // helmet helps set a variety of headers to better secure your app
  app.use(helmet({
    contentSecurityPolicy: false
  }));

  app.use(
    csrfSync({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        }
    })
  )

  const routes = require('./routes');

  app.use(routes);

  module.exports = app;
