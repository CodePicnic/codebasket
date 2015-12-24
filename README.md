# Codebasket

Codebasket is a client-side interface for [CodePicnic](https://codepicnic.com)'s consoles. It can be used as a simple web-based editor or as a web UI for other Docker-container-as-a-services.

## Requirements

* JavaScript 😉
* [ACE editor](https://ace.c9.io/)

## Installation

### From NPM (Using Browserify or Webpack):

`npm install codebasket`

### Using `<script>`:

Use the `codebasket.js` file located in the `build` folder.

## Usage

### From NPM (Using Browserify or Webpack):

```javascript
var CodeBasket = require('codebasket'),
    basket = CodeBasket.create({
      element: '#codebasket-test'
    });

basket.render();
```

### Using `<script>`:

```javascript
<div id="codebasket-test"></div>

<script src="codebasket.js"></script>
<script>
  var basket = CodeBasket.create({
    element: '#codebasket-test'
  });

  basket.render();
</script>
```

Also, you need to add the `codebasket.css` file for style the interface. You can change the source (in SASS) by editing the `sass` folder.

## Building

Clone the repository:

`git clone https://github.com/CodePicnic/codebasket`

And run the `dist` task in your terminal (you must have [Gulp](http://gulpjs.com) installed in your machine):

`gulp dist`

To create a minified version run:

`NODE_ENV=production gulp dist`

## Testing

Run `gulp test` in your terminal (you can also open the `test/runner.html` file in a browser).

## Browser support

Tested in:

* Google Chrome
* Mozilla Firefox
* Apple Safari
* Opera

## License

MIT License. Copyright 2015 Gustavo Leon. http://github.com/hpneo

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.