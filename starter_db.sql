DROP DATABASE IF EXISTS speakeasy_2fa;
CREATE DATABASE speakeasy_2fa;

\c speakeasy_2fa;

CREATE TABLE secrets (
  ID SERIAL PRIMARY KEY,
  secret VARCHAR
);
