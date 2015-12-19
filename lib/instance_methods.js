'use strict';

var find = require('lodash/collection/find'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app');

function addItem(newItem) {
  this.items.push(newItem);
}

function addFile(newFile) {
  newFile.type = 'file';

  this.items.push(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);
}

function findItem(name) {
  return find(this.items, function(item) { return item.name === name; });
}

function findFile(name) {
  return find(this.items, function(item) { return item.type === 'file' && item.name === name; });
}

function selectItem(newActiveItem) {
  var activeItem = this.items.find(function(item) { return item.isActive });

  activeItem.isActive = false;
  newActiveItem.isActive = true;
  this.render();
}

function render() {
  if (this.element) {
    this.view = ReactDOM.render(React.createElement(App, { codeBasket: this }), this.element);
  }
}

module.exports = {
  addItem: addItem,
  addFile: addFile,
  addLibrary: addLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  render: render
};