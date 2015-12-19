"use strict";

var mixin = require('lodash/utility/mixin'),
    forEach = require('lodash/collection/forEach'),
    internalMethods = require('./lib/internal_methods'),
    instanceMethods = require('./lib/instance_methods'),
    CodeBasket = {};

CodeBasket.create = function(options) {
  var items = options.items || [],
      libraries = options.libraries || [],
      optionsList = options.options || [],
      filesFromDOM,
      newCodeBasket;

  if (!options.element) {
    throw "You need to set a container element";
  }

  newCodeBasket = {
    element: internalMethods.getElement(options.element),
    libraries: libraries,
    items: items,
    options: optionsList
  };

  filesFromDOM = internalMethods.extractFilesFromDOM(newCodeBasket.element);

  mixin(newCodeBasket, instanceMethods);
  forEach(filesFromDOM, newCodeBasket.addItem, newCodeBasket);

  var readyEvent = new global.CustomEvent('codebasket:ready', {
    detail: {
      codeBasket: newCodeBasket
    }
  });

  global.dispatchEvent(readyEvent);

  return newCodeBasket;
};

global.CodeBasket = CodeBasket;