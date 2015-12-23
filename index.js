"use strict";

var mixin = require('lodash/utility/mixin'),
    forEach = require('lodash/collection/forEach'),
    merge = require('lodash/object/merge'),
    internalMethods = require('./lib/internal_methods'),
    instanceMethods = require('./lib/instance_methods'),
    CodeBasket = {};

CodeBasket.create = function(options) {
  var optionsList = options.options || [],
      toolbarOptions = options.toolbarOptions || [],
      uiOptionsList = options.ui || {},
      uiOptions = merge({}, uiOptionsList, {
        isSidebarVisible: true,
        isProgressBarVisible: false
      }),
      filesFromDOM,
      newCodeBasket;

  if (!options.element) {
    throw "You need to set a container element";
  }

  newCodeBasket = {
    element: internalMethods.getElement(options.element),
    libraries: [],
    items: [],
    sidebarItems: {},
    options: optionsList,
    toolbarOptions: toolbarOptions,
    uiOptions: uiOptions
  };

  filesFromDOM = internalMethods.extractFilesFromDOM(newCodeBasket.element);

  mixin(newCodeBasket, instanceMethods);
  forEach(options.items, newCodeBasket.addItem, newCodeBasket);
  forEach(options.libraries, newCodeBasket.addLibrary, newCodeBasket);
  forEach(filesFromDOM, newCodeBasket.addFile, newCodeBasket);

  var readyEvent = new global.CustomEvent('codebasket:ready', {
    detail: {
      codeBasket: newCodeBasket
    }
  });

  global.dispatchEvent(readyEvent);

  return newCodeBasket;
};

global.CodeBasket = CodeBasket;