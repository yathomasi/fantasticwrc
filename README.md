# FantasticWRC
### Node.js, Express & MySQL: Simple Create, Retrieve, Update & Delete (CRUD) App
This is a simple CRUD application (Create, Retrieve, Update, Delete) application by using mysql query for database handling. I also added a simple authentication(i.e. single user login) at last because I wanted to deploy at herokuapp [fantasticwrc] and didn't want others to edit and delete the data.
### Stack 
FantasticWRC is based on following
- [Node.js] - evented I/O for the backend
- [Express] - web framework  for handling and routing HTTP requests
- [Mysql] - for database
- [Pug] (~~Jade~~) - high-performance templating language
- [Passport] - Express-compatibale authentication middleware for Node.js
- [Twitter Bootstrap] - Thanks [PUG-Bootstrap] for the pug implementation

# Getting Started
To get the Node server running locally:
### Installation
Make sure you have  [Node.js](https://nodejs.org/) and [MySQL] installed. Here Nodejs version v8.11.3 LTS is used to run.

Clone this repo:

` git clone https://github.com/yathomasi/fantasticwrc.git `

Install the dependencies and devDependencies .
```sh
$ cd fantasticwrc
$ npm install -d
```
**Manage Environment File**

You can create a new `.env` file in root directoyy and copy`.env.default`content.

OR
Copy the file `.env.default` to `.env` and replace the value in key=value format environment file

Now use ***mysql*** to create a database and update the .env files values according to your mysql host,user,password and database name in DB_HOST, DB_USER, DB_PASSWORD & DB_NAME respectively.

    Note: USERNAME & PASSWORD is key for single user authentication
Now 

**Create two table in the database `users` and `gw`**
```
CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(200)  NOT NULL,
 `team` varchar(100)  NOT NULL,
 `address` text  NOT NULL,
 `email` varchar(100) NOT NULL,
 `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

CREATE TABLE `gw` (
	`num` int(11) not null unique,
    `winid` int(11) not null,
);
```

Now let's run the server

`$ npm run start ` for simple run

`$ npm run devstart` run using [nodemon]

`$ DEBUG=fantasy:* npm run devstart ` debug mode with [nodemon]

### Use in real-wrold for FANTASTICWRC
We have a Classic League as FantasticWRC in [FantasyPremierLeague](https://fantasy.premierleague.com) including current and ex-student.

And the student information is collected using Google Docs and that will be added to the database and if necessary we can add the details from this site.
Each Premier League GameWeek there is a winner for 38 Week so there is drop down to select the week and the Players is also listed in dropdown. Select the winner to add to the database.

There is edit and delete options for any update in the details.

This app is deployed in herokuapp <https://fantasticwrc.herokuapp.com>(But sorry it is not accessible for others now)

But You can easily deploy on your own in [Heroku] using it's great documentation. And for mysql you can use [ClearDB] and free database provided there by Google Cloud Platform or SOFTLAYER is enough for this.

### Todos 

 - MultiUser Authentication
 - Unauthenticated can view certain part like winners list
 



[Node.js]: <http://nodejs.org>
[Pug]: <https://pugjs.org>
[Mysql]: <https://mysql.com>
[Passport]: <https://passportjs.org>
[fantasticwrc]:<http://fantasticwrc.herokuapp.com>
[nodemon]:<https://github.com/remy/nodemon>
[pug-bootstrap]:<https://github.com/rajasegar/PUG-Bootstrap>
[Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
[jQuery]: <http://jquery.com>
[express]: <http://expressjs.com>
[heroku]:<https://heroku.com>
[cleardb]:<http://w2.cleardb.net>
