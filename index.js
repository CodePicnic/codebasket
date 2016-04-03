"use strict";

var mixin = require('lodash/utility/mixin'),
    forEach = require('lodash/collection/forEach'),
    merge = require('lodash/object/merge'),
    internalMethods = require('./lib/internal_methods'),
    instanceMethods = require('./lib/instance_methods'),
    CodeBasket = {};

CodeBasket.create = function(options) {
  var optionsList = options.options || [],
      brand = options.brand,
      toolbarOptions = options.toolbarOptions || [],
      uiOptionsList = options.ui || {},
      sidebarActions = options.sidebarActions || [],
      floatingButtons = options.floatingButtons || [],
      permanentStatus = options.permanentStatus || '',
      uiOptions = merge({}, {
        sidebarSize: 200,
        isSidebarVisible: true,
        isProgressBarVisible: false,
        isAddTabVisible: true,
        isFullScreen: false
      }, uiOptionsList),
      filesFromDOM,
      librariesFromDOM,
      newCodeBasket;

  if (!options.element) {
    throw "You need to set a container element";
  }

  uiOptions.isSidebarVisible =  uiOptions.isFullScreen ? false : uiOptions.isSidebarVisible;

  newCodeBasket = {
    element: internalMethods.getElement(options.element),
    brand: brand,
    libraries: [],
    items: [],
    sidebarItems: {},
    sidebarActions: sidebarActions,
    options: optionsList,
    toolbarOptions: toolbarOptions,
    floatingButtons: floatingButtons,
    uiOptions: uiOptions,
    permanentStatus: permanentStatus
  };

  filesFromDOM = internalMethods.extractFilesFromDOM(newCodeBasket.element);
  librariesFromDOM = internalMethods.extractLibrariesFromDOM(newCodeBasket.element);

  mixin(newCodeBasket, instanceMethods);
  forEach(options.items, newCodeBasket.addItem, newCodeBasket);
  forEach(options.libraries, newCodeBasket.addLibrary, newCodeBasket);
  forEach(filesFromDOM, newCodeBasket.addFile, newCodeBasket);
  forEach(librariesFromDOM, newCodeBasket.toggleLibrary, newCodeBasket);

  // var readyEvent = global.document.createEvent('CustomEvent');
  // readyEvent.initCustomEvent('codebasket:ready', true, true, {
  //   codeBasket: newCodeBasket
  // });
  //
  // global.dispatchEvent(readyEvent);

  return newCodeBasket;
};

global.CodeBasket = CodeBasket;