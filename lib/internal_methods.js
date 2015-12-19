'use strict';

var map = require('lodash/collection/map');

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
    var itemLanguage = (preElement.dataset('language') || 'js'),
        itemName = (preElement.dataset('name') || (index + '.' + itemLanguage)),
        itemContent = preElement.textContent;

    return {
      type: 'file',
      language: itemLanguage,
      name: itemName,
      title: itemName,
      content: itemContent
    };
  });
}

module.exports = {
  getElement: getElement,
  extractFilesFromDOM: extractFilesFromDOM
};