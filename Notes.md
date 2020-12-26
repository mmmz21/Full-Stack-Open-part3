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
