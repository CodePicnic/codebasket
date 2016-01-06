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

  forEach(preElements, function(preElement, index) {
    if (preElement.dataset['libs']) {
      var elementLibraries = preElement.dataset['libs'].split(';');

      libraries = libraries.concat(elementLibraries);
    }
  });

  return libraries;
}

module.exports = {
  getElement: getElement,
  extractFilesFromDOM: extractFilesFromDOM,
  extractLibrariesFromDOM: extractLibrariesFromDOM
};