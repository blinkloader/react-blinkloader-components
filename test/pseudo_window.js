const jsdom = require("jsdom");
const request = require('sync-request');

const { JSDOM } = jsdom;

const window = new JSDOM(`<!DOCTYPE html>
  <head>
  </head>
  <body>
  </body>
  </html>`, {
    runScripts: "dangerously"
  }).window;


const script = window.document.createElement("script");
script.type = "text/javascript";

// you have to run blinkloader.js server on localhost:8080
const res = request('GET', 'http://localhost:8080/versions/blinkloader-2.0.0.min.js')
script.innerHTML = res.body.toString('utf-8') 

const head = window.document.getElementsByTagName('head')[0];
head.appendChild(script);

function copyPropertyRefs(src, target) {
  Object.keys(src).forEach((property) => {
    if (typeof target[property] === 'undefined') {
      target[property] = src[property];
    }
  });
}

export function setup() {
  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js'
  };
  copyPropertyRefs(window, global);
}
