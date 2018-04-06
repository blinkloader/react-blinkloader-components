const jsdom = require("jsdom");
const request = require('sync-request');

const { JSDOM } = jsdom;

const window = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
  runScripts: "dangerously"
}).window;

const script = window.document.createElement("script");
script.type = "text/javascript";

const res = request('GET', 'https://cdn.blinkloader.com/blinkloader-1.0.4.min.js')
script.innerHTML = res.body.toString('utf-8') 

const head = window.document.getElementsByTagName('head')[0];
head.appendChild(script);

window.eval(`
  Blinkloader.version = "1.2.0";
`);

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
