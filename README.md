# conference

System to review and author submissions for a conference XYZ. 

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


# Role and Access Management

While you are operating in the api folder you can use the authentication service by using this line:
`import * as auth from '../../auth/auth.service';`

Afterwards you are able to check whether a user has certain role:

`auth.checkRoles(rolesHeNeeds, rolesHeHas, granted, forbidden)`

rolesHeNeeds: String || Array - Role Names that you want to check
rolesHeHas: typically you can use req.user.role

granted and forbidden are two functions that you need to provide as callback functions.
e.g.

### Check multiple Roles
`auth.checkRoles(['author', 'chair'], req.user.role, function() {
  console.log('Granted :)');
  res.status(200);
}, function() {
  res.status(403).send('Forbidden');
});`

### check specific role
`auth.checkRoles('author', req.user.role, function() {
  console.log('Granted :)');
  res.status(200);
}, function() {
  res.status(403).send('Forbidden');
});`

