CREATE DATABASE lun903;
CREATE ROLE admin WITH PASSWORD 'root';
ALTER ROLE admin WITH LOGIN;
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
ALTER DATABASE lun903 OWNER TO admin;
GRANT ALL PRIVILEGES ON DATABASE lun903 TO admin;
