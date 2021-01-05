# Part 3
### a) Node.js and Express
Now we want to implement the backend using **NodeJS**, which is a JavaScript runtime based on Google's Chrome V8 JavaScript engine.
Node supports most new features of JS, so the code doesn't need to be transpied. 

To get started:
```console
$ npm init
```
Answer guestions, then go into package.json file and add a line to the scripts object:
```JSX
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": node index.js, // add this line!
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Matti Luukkainen",
  "license": "MIT"
}
```
Now add an index.js file, and run using 
```console
$ node index.js 
```
or 
```console
$ npm start
```
which works since it was defined in the package.json file. 

### Simple web server
In index.js: 
```javascript
const http = require('http')
```
The code uses the createServer method of the http module to create a new web server. An event handler is registered to the server, that is called every time an HTTP
request is made to the server's address http://localhost:3001.

The request is responded to with the status code 200, with the Content-Type header set to text/plain, and the content of the site to be returned set to Hello World.
```javascript
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})
```
The last rows bind the http server assigned to the app variable, to listen to HTTP requests sent to the port 3001:
```JSX
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

The primary purpose of the backend server in this course is to offer raw data in the JSON format to the frontend. For this reason, let's immediately change our server to return a hardcoded list of notes in the JSON format:
```javascript
const http = require('http')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```
Now restart the server (`CTRL+C`) and refresh the browser.

The application/json value in the Content-Type header informs the receiver that the data is in the JSON format. The notes array gets transformed into JSON with the JSON.stringify(notes) method.

### Express
Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

express is a libary (one of many) developed developed to ease server side development with Node, by offering a more pleasing interface to work with the built-in http module.
```console
$ npm install express
```
Add the dependency to the package.json file:
```javascript
{
  // ...
  "dependencies": {
    "express": "^4.17.1"
  }
}
```
The source code for the dependency is installed to the node_modules directory. In that folder will be many other dependencies- dependencies of the express library, and dependencies
of all it's dependencies, and so forth, known as **transitive dependencies**. 

What does the caret(^) in front of the version number in package.json mean?
```javascript
"express": "^4.17.1" 
```
The versioning model used in npm is called semantic versioning.

The caret in the front of ^4.17.1 means, that if and when the dependencies of a project are updated, the version of express that is installed will be at least 4.17.1. However, the installed version of express can also be one that has a larger patch number (the last number), or a larger minor number (the middle number). The major version of the library indicated by the first major number must be the same.

The dependencies of the project can be updated using:
```console
$ npm update 
```
Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json with the command:
``` console
$ npm install 
```

### Web and express
Change index.js to look like:
``` jsx
const express = require('express')
// an express application stored in the app variable
const app = express()

let notes = [
  ...
]

// define two routes to the application - one to root, and one to notes 
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// the event handler accepts two parameters - the request with all the info for an HTTP request, and a response to define how the request is reponded to
app.get('/api/notes', (request, response) => {
  // formats and sends the notes array as a JSON formatted string
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```
### nodemon
If we make changes to the application's code we have to restart the application in order to see the changes. We restart the application by first shutting it down by typing Ctrl+C and then restarting the application.

The solution to this problem is **nodemon** which will watch the files in the directory in which nodemon was started. If any files change, nodemon will automatically restart your node application.

Install nodemon as a development dependency:
```console
$ npm install --save-dev nodemon
```
and change the package.json file:
```javascript
{
  // ..
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js", // by adding this line!
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```
We can now start the server in dev mode:
```console
$ npm run dev
```

### REST 
Let's expand our application so that it provides the RESTful HTTP API as json-server.

Singular things, like notes in the case of our application, are called resources in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier.

If we define the resource type of notes to be note, then the address of a note resource with the identifier 10, has the unique address www.example.com/api/notes/10.

The URL for the entire collection of all note resources is www.example.com/api/notes.

We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:

<pre>
URL             verb       functionality

notes/10      GET	         fetches a single resource

notes         GET	         fetches all resources in the collection

notes         POST	       creates a new resource based on the request data

notes/10      DELETE	     removes the identified resource

notes/10      PUT	         replaces the entire identified resource with the request data

notes/10      PATCH	       replaces a part of the identified resource with the request data
</pre>

This is how we manage to roughly define what REST refers to as a uniform interface, which means a consistent way of defining interfaces that makes it possible for systems to co-operate.

### Fetching a single resource
Let's create a route for fetching a single resource:
```JSX
app.get('/api/notes/:id', (request, response) => {
  // the id is a string by default 
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
```
### Deleting resources
```javascript
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
```
### Postman and the Visual Studio Rest Client 
either can be used to test HTTP requests/responses

### Receiving data
Now, allow new notes to be added to the server. Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in the JSON format.

In order to access the data easily, we need the help of the express json-parser, that is taken to use with command app.use(express.json()).
```javascript
const express = require('express')
const app = express()

app.use(express.json())
//... 

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
```
Degbugging: One of the main issues is a missing Content-type header, which will cause the code to not work. Check the content-type header using `console.log(request.headers)`

### About HTTP request types
The HTTP standard talks about two properties related to request types, safety and idempotence.
- **Safety** means that the executing request must not cause any side effects in the server/change the state of the database (GET and HEAD)
- **Idempotence** means that if a request has side-effects, then the result should be the same regardless of how many times the request is sent (true for GET, HEAD, PUT, DELETE but not POST)

### Middleware
**Middleware** are functions that can be used for handling request and response objects (like the express json-parser)

Middleware is a function that receives three parameters:
```JSX
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next() // yields control to the next middleware (if multiple are used)
}
```
Middleware is used like:
```JSX
app.use(requestLogger)
```
Middleware functions are called in the order that they're taken into use with the express server object's use method. 

Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.
```javascript
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

# b) Deploying app to internet
### Same origin policy and CORS
**Cross-origin resource sharing (CORS)*** is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

! By default, JS code that runs in a browser can only communicate with a server in the **same origin**. Because our server is in localhost port 3001, and our frontend in localhost port 3000, they do not have the same origin.

We can allow requests from other origins by using Node's cors middleware. 
```console
$ npm install cors
```
take the middleware to use and allow for requests from all origins:
```javascript
const cors = require('cors')
app.use(cors())
```
### Application to the Internet

Now that the whole stack is ready, let's move our application to the internet. We'll use Heroku for this.

Add a file called Procfile to tell Heroku how to start the app:
```jsx
web: npm start
```
IMPORTANT- I actually did `web: node index.js` inside of Procfile. If you want Heroku to work with npm you need to initialize the Heroku project differently.

Change the definition of the port our application uses at the bottom of the index.js file like so:
```JSX
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```
Now we are using the port defined in environment variable PORT or port 3001 if the environment variable PORT is undefined. Heroku configures application port based on the environment variable.

Create a Git repository in the project directory, and add .gitignore with `node_modules` in it

Now create a Heroku application using `heroku create`, commit your code to the repository, and move it to Heroku with command `git push heroku main` (or `git push heroku HEAD:master`)

**To debug**, read the logs using `heroku logs`

The application now runs at:
protected-peak.herokuapp.com/api/notes

### Frontend production build
So far we have been running React code in development mode. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a **production build**. 

A production build of applications created with create-react-app can be created with command `npm run build` at the root of the frontend project (part 2 - phonebook). 

This creates a directory called *build* (which contains the only HTML file of our application, index.html ) which contains the directory *static*. **Minified** version of our application's JavaScript code will be generated to the static directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file.

### Serving static files from the backend 
One option for deploying the frontend is to copy the production build (the build directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file build/index.html) as its main page.

To make express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from express called **static**.
 ```javascript
 app.use(express.static('build'))
 ```
Now www.serveraddress.com/index.html and www.serveraddress.com show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.

Now both the frontend and the backend are at the same address, so in the front end (Part2 for the phonebook, person.js), we can decare baseUrl as a relative URL and leave out the part declaring the server. 
Original:
```JSX
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
```
New:
import axios from 'axios'
const baseUrl = '/api/notes'
```
Now create a new production build and copy it to the backend repo. 

### Streamlining deploying of the frontend 
Add some npm-scripts to the backend package.json:
```javascript
  "scripts": {
    //...
    "build:ui": "rm -rf build && cd ../../osa2/materiaali/notes-new && npm run build --prod && cp -r build ../../../osa3/notes-backend/", 
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",    
    "logs:prod": "heroku logs --tail"
  }
}
```
The script `npm run build:ui` builds the frontend and copies the production version under the backend repository. `npm run` deploy releases the current backend to heroku.

`npm run deploy:full` combines these two and contains the necessary git commands to update the backend repository.

There is also a script `npm run logs:prod` to show the heroku logs.

### Proxy
Changes on the frontend have caused it to no longer work in development mode (when started with command npm start), as the connection to the backend does not work (since the baseUrl was changed from "http://localhost:3001" to 'api/notes')

Because in development mode the frontend is at the address localhost:3000, the requests to the backend go to the wrong address localhost:3000/api/notes. The backend is at localhost:3001.

So add this to the frontend package.json file:
```javascript
  "dependencies": {
    // ...
  },
  "scripts": {
    // ...
  },
  "proxy": "http://localhost:3001"
}
```
After a restart, the React development environment will work as a proxy. If the React code does an HTTP request to a server address at http://localhost:3000 not managed by the React application itself (i.e. when requests are not about fetching the CSS or JavaScript of the application), the request will be redirected to the server at http://localhost:3001.

Now the frontend is also fine, working with the server both in development- and production mode.

A negative aspect of our approach is how complicated it is to deploy the frontend. Deploying a new version requires generating new production build of the frontend and copying it to the backend repository. This makes creating an automated deployment pipeline more difficult. **Deployment pipeline** means an automated and controlled way to move the code from the computer of the developer through different tests and quality checks to the production environment.

# c) Saving data to MongoDB
### Debugging node applications
**Visual Studio code** - start debugging mode from the top menu, you may have to configure the launch.json file by choosing "Add configuration..." under the Debug drop-down mun, and selecting "Run "npm start" in a debug terminal.

**Chrome dev tools** - start application with the command `node --inspect index.js` then click the green icon in the Chrome developer console. Go to the Sources tab to set breakpoints
### MongoDB 
To store our saved notes indefinitely, we need a database. **MongoDB** is a document/NoSQL/non-relational database. MongoDB stores data records as bSON (binary representation of JSON) **documents**, which are gathered together in **collections**. A **database** stores 1+ collections.

Documents are composed of field-value pairs:
```
var mydoc = {
               _id: ObjectId("5099803df3f4948bd2f98391"),  <--- primary key
               name: { first: "Alan", last: "Turing" },
               birth: new Date('Jun 23, 1912'),
               death: new Date('Jun 07, 1954'),
               contribs: [ "Turing machine", "Turing test", "Turingery" ],
               views : NumberLong(1250000)
            }
```
Go to MongoDB Atlas and create a cluster using AWS as the provider. Then create a user and grant them read/write permission. Allow access from any IP. Click connect, 'connect your application' and then copy the connection string. 

Then install mongoose `npm install mongoose`, 
Test using a practice application, mongo.js: 
```javascript
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```
Run the code using `node mongo.js password` and Mongo will create a database called test and add a new document called note in the notes collection to it. This can be viewed in the cluster under the collections tab. 

### Schema 
After establishing a connection to the database, we define the **schema** (defines the shapes of documents within a collection) for a note and the matching **model** (a constructor function that creates new JS objects based on the provided parameters): 
 ```javascript
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
```
The the Note model definition, the 'Note' parameter will be the name of the model (and the name of the collection will automatically become 'notes'). Mongoose itself is schemaless, but at the application level it's good to define the shape of the documents. 
### Creating and saving objects
Create a new object with the help of the Note model, and save:
 ```javascript
 const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: false,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
```
### Fetching objects from the database 
Print all the notes in the database:
```javascript 
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
```
### Backend connected to a database
Now copy over the Mongoose definitions to index.js (minus the argv stuff). 
Change the handler to:
```javascript
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
````
The documents should now be displayed at localhost:3001/api/notes.Except we don't want to see the \_id or \_v fields. 

We can modify the toJSON method of the schema:
```javascript
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```
The \_id field is an object, which we transform to a string. 
The HTTP request now returns a list of objects formatted using `toJSON`:
```javascript
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})
```
### Database configuration into its own module
Extract all Mongoose specfici code into it's own module, in a directory called *models* in a file called *note.js*. 
Put this line at the end to export as a Node module (different from ES6 modules):
```javascript
module.exports = mongoose.model('Note', noteSchema)
```
The import into index.js using:
```javscript
const Note = require('./models/note')
```
Also note there were changes to the way the connection was made:
```javascript
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
```
