'use strict';

var find = require('lodash/collection/find'),
    forEach = require('lodash/collection/forEach'),
    remove = require('lodash/array/remove'),
    includes = require('lodash/collection/includes'),
    ace = global.ace,
    React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app'),
    constants = require('./constants');

function createFileSession(item) {
  if (item.type === 'file') {
    if (item.session) {
      return item.session;
    }
    else {
      var fileLanguage = (constants.MODES[item.language] || item.language),
          session = new ace.EditSession(item.content, 'ace/mode/' + fileLanguage);

      session.$id = fileLanguage + '-' + item.name;
      session.setOptions({
        firstLineNumber: 1,
        indentedSoftWrap: true,
        newLineMode: "auto",
        overwrite: false,
        tabSize: 2,
        useSoftTabs: true,
        useWorker: true,
        wrap: "off",
        wrapMethod: "auto"
      });

      session.setUndoManager(new ace.UndoManager());
      session.setValue(item.content || '');
      session.setUseWrapMode(true);

      return session;
    }
  }
}

function addItem(newItem) {
  if (newItem.isVisible === undefined) {
    newItem.isVisible = true;
  }

  if (newItem.type === 'file') {
    newItem.session = createFileSession(newItem);
  }

  if (newItem.title === undefined) {
    newItem.title = newItem.name;
  }

  this.items.push(newItem);
}

function addFile(newFile) {
  newFile.type = 'file';
  newFile.session = createFileSession(newFile);

  this.addItem(newFile);
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

function hasLibrary(library) {
  return includes(this.libraries, library);
}

function removeLibrary(library) {
  remove(this.libraries, function(item) { return item === library; });
}

function toggleLibrary(library) {
  if (this.hasLibrary(library)) {
    this.removeLibrary(library);
  }
  else {
    this.addLibrary(library);
  }
}

function selectItem(item) {
  var activeItem = find(this.items, function(item) { return item.isActive });

  activeItem.isActive = false;
  item.isActive = true;

  if (item.type === 'file' && item.session && this.editor) {
    this.editor.setSession(item.session);
    this.editor.focus();
  }

  this.render();
}

function addSidebarItems(paths, types, rootPath) {
  var sidebarItems = this.sidebarItems;

  if (rootPath) {
    rootPath.split('/').forEach(function(path) {
      sidebarItems = sidebarItems[path].files;
    });
  }

  forEach(paths, function(filePath, fileName) {
    var type = types[filePath],
        fileInfo;

    if (type) {
      fileInfo = {
        name: fileName,
        path: filePath,
        type: type
      };

      if (type.match('directory')) {
        fileInfo.files = {};
      }

      sidebarItems[fileName] = fileInfo;
    }
  });

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
  removeLibrary: removeLibrary,
  hasLibrary: hasLibrary,
  toggleLibrary: toggleLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  addSidebarItems: addSidebarItems,
  render: render
};