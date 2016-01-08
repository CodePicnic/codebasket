'use strict';

var map = require('lodash/collection/map'),
    forEach = require('lodash/collection/forEach');

function getElement(selectorOrElement) {
  var element;

  if (typeof selectorOrElement === 'string') {
    element = global.document.querySelector(selectorOrElement);
  }
  else {
    element = selectorOrElement;
  }

  return element;
}

function extractFilesFromDOM(element) {
  var preElements = element.querySelectorAll('pre');

  return map(preElements, function(preElement, index) {
    var itemLanguage = (preElement.dataset['lang'] || preElement.dataset['language'] || 'js'),
        itemName = (preElement.dataset['name'] || (index + '.' + itemLanguage)),
        itemContent = preElement.textContent;

    return {
      type: 'file',
      language: itemLanguage,
      name: itemName,
      title: itemName,
      content: itemContent,
      isCloseable: true
    };
  });
}

function extractLibrariesFromDOM(element) {
  var preElements = element.querySelectorAll('pre'),
      libraries = [];

  forEach(preElements, function(preElement) {
    if (preElement.dataset['libs']) {
      var elementLibraries = preElement.dataset['libs'].split(';');

      libraries = libraries.concat(elementLibraries);
    }
  });

  return libraries;
}

function detectType(content) {
  var type;

  if (Array.isArray(content)) {
    type = 'array';
  }
  else if (content === null) {
    type = 'null';
  }
  else if (content === undefined) {
    type = 'undefined';
  }
  else if (typeof content === 'object') {
    type = 'object';
  }
  else if (typeof content === 'string') {
    type = 'string';
  }
  else if (typeof content === 'number') {
    type = 'number';
  }
  else if (typeof content === 'boolean') {
    type = 'boolean';
  }
  else {
    type = 'wildcard';
  }

  return type;
}

module.exports = {
  getElement: getElement,
  extractFilesFromDOM: extractFilesFromDOM,
  extractLibrariesFromDOM: extractLibrariesFromDOM,
  detectType: detectType
};