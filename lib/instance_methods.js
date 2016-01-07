'use strict';

var find = require('lodash/collection/find'),
    filter = require('lodash/collection/filter'),
    forEach = require('lodash/collection/forEach'),
    pull = require('lodash/array/pull'),
    includes = require('lodash/collection/includes'),
    constants = require('./constants'),
    ace = global.ace;

var React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app');

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
        newLineMode: 'auto',
        overwrite: false,
        tabSize: 2,
        useSoftTabs: true,
        useWorker: true,
        wrap: 'off',
        wrapMethod: 'auto'
      });

      session.setUndoManager(new ace.UndoManager());
      session.setValue(item.content || '');
      session.setUseWrapMode(true);

      var addSessionEvent = new global.CustomEvent('codebasket:addsession', {
        detail: {
          codeBasket: this,
          item: item
        }
      });

      window.dispatchEvent(addSessionEvent);

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

function addFileAndOpen(newFile) {
  newFile.isVisible = true;

  this.addFile(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);

  var addLibraryEvent = new global.CustomEvent('codebasket:addlibrary', {
    detail: {
      codeBasket: this,
      library: newLibrary
    }
  });

  global.dispatchEvent(addLibraryEvent);
}

function hasLibrary(library) {
  return includes(this.libraries, library);
}

function removeLibrary(library) {
  pull(this.libraries, library);

  var removeLibraryEvent = new global.CustomEvent('codebasket:removelibrary', {
    detail: {
      codeBasket: this,
      library: library
    }
  });

  global.dispatchEvent(removeLibraryEvent);
}

function toggleLibrary(library) {
  if (this.hasLibrary(library)) {
    this.removeLibrary(library);
  }
  else {
    this.addLibrary(library);
  }
}

function findItem(name) {
  return find(this.items, function(item) { return item.name === name; });
}

function findFile(name) {
  return find(this.items, function(item) { return item.type === 'file' && item.name === name; });
}

function selectItem(item, index) {
  var activeItem = find(this.items, function(item) { return item.isActive });

  if (activeItem) {
    activeItem.isActive = false;
  }

  item.isActive = true;

  if (item.type === 'file' && item.session && this.editor) {
    this.editor.setSession(item.session);
    this.editor.focus();
  }

  this.render();
}

function renameItem(item, newName) {
  item.title = item.name = newName;

  this.render();
}

function removeItem(item) {
  pull(this.items, item);

  return item;
}

function enableEditMode(item) {
  var otherItems = filter(this.items, function(itemInArray) { return itemInArray.isEditing; });
  forEach(otherItems, function(itemInArray) { itemInArray.isEditing = false; });
  item.isEditing = true;

  this.render();
}

function disableEditMode(item) {
  item.isEditing = false;

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

function findInSidebar(path) {
  var sidebarItems = this.sidebarItems;

  forEach(path.split('/'), function(pathPart) {
    if (sidebarItems[pathPart]) {
      if (sidebarItems[pathPart].files) {
        sidebarItems = sidebarItems[pathPart].files;
      }
      else {
        sidebarItems = sidebarItems[pathPart];
      }
    }
  });

  return sidebarItems;
}

function removeItemFromSidebar(path) {
  var directory = path.split('/'),
      fileName = directory.pop(),
      sidebarItems;

  directory = directory.join('/');
  sidebarItems = this.findInSidebar(directory);

  delete sidebarItems[fileName];
}

function setStatus(status) {
  this.status = status;

  this.render();
}

function showProgress() {
  this.view.setState({ isProgressBarVisible: true });
}

function hideProgress() {
  this.view.setState({ isProgressBarVisible: false });
}

function showSidebarProgress() {
  this.view.setState({ isSidebarLoading: true });
};

function hideSidebarProgress() {
  this.view.setState({ isSidebarLoading: false });
};

function render() {
  if (this.element) {
    this.view = ReactDOM.render(React.createElement(App, { codeBasket: this }), this.element);
  }
}

function toString() {
  if (this.element) {
    var files = filter(this.items, function(item) { return item.type === 'file'; }),
        preElements;

    preElements = files.map(function(item) {
      var element = global.document.createElement('pre');

      element.dataset['language'] = item.language;
      element.dataset['name'] = item.name;

      element.textContent = item.session.getValue();

      return element;
    });

    if (preElements.length > 0) {
      preElements[0].dataset['libs'] = this.libraries.join(';');
    }

    return preElements.map(function(element) { return element.outerHTML }).join('\n');
  }
}

module.exports = {
  addItem: addItem,
  addFile: addFile,
  addFileAndOpen: addFileAndOpen,
  addLibrary: addLibrary,
  removeLibrary: removeLibrary,
  hasLibrary: hasLibrary,
  toggleLibrary: toggleLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  renameItem: renameItem,
  removeItem: removeItem,
  enableEditMode: enableEditMode,
  disableEditMode: disableEditMode,
  addSidebarItems: addSidebarItems,
  findInSidebar: findInSidebar,
  removeItemFromSidebar: removeItemFromSidebar,
  render: render,
  setStatus: setStatus,
  showProgress: showProgress,
  hideProgress: hideProgress,
  showSidebarProgress: showSidebarProgress,
  hideSidebarProgress: hideSidebarProgress,
  toString: toString
};