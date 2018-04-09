const jsdom = require("jsdom");
const request = require('sync-request');

const { JSDOM } = jsdom;

const window = new JSDOM(`<!DOCTYPE html>
  <body>
  </body>
  </html>`, {
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

  var lazyloader = {
    started: false,
    sorted: false,
    images: [],
    totalnum: 0,
  };
  lazyloader.registerImage = function(imagefunc, offset) {
    this.images.push({imagefunc: imagefunc, offset: offset});
  }
  lazyloader.addImage = function() {
    this.totalnum++;
  }
  lazyloader.loadImage = function() {
    if (this.started) {
      return
    }
    if (this.images.length !== this.totalnum) {
      return
    }
    if (!this.sorted) {
      this.images.sort(function(a, b) {
        return a.offset >= b.offset ? 1 : -1;
      });
    }
    this.images.forEach(function(i, n) {
      setTimeout(function() {
        i.imagefunc();
      }, (n+1)*40);
    });
    this.images = [];
    this.started = false;
    this.sorted = false;
  }
  
  Blinkloader.lazyloader = lazyloader;

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
