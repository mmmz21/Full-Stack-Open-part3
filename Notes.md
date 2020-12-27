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
