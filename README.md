# conference

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.6.1.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [Postgres](http://www.postgresql.org/)

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Copy `app.sh.sample` and name it `app.sh`.

4. Modify the `SEQUELIZE_URI` to match your local Postgres-Database Configuration.

5. Allow the `app.sh` to be executed by executing `chmod +x app.sh`

3. Run `./app.sh serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `./app.sh build` for building and `./app.sh serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
