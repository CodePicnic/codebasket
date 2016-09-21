"use strict";

var mixin = require('lodash/utility/mixin'),
    forEach = require('lodash/collection/forEach'),
    merge = require('lodash/object/merge'),
    EventEmitter = require('events').EventEmitter,
    internalMethods = require('./lib/internal_methods'),
    instanceMethods = require('./lib/instance_methods'),
    CodeBasket = {};

CodeBasket.create = function(options) {
  if (!options.element) {
    throw 'You need to set a container element';
  }

  var optionsList = options.options || [],
      brand = options.brand,
      actions = options.actions || [],
      extraActions = options.extraActions || [],
      uiOptionsList = options.ui || {},
      sidebarActions = options.sidebarActions || [],
      floatingButtons = options.floatingButtons || [],
      permanentStatus = options.permanentStatus || '',
      uiOptions = merge({}, {
        sidebarSize: 200,
        isSidebarVisible: true,
        isProgressBarVisible: false,
        isAddTabVisible: true,
        isFullScreen: false,
        splitMode: null
      }, uiOptionsList),
      filesFromDOM,
      librariesFromDOM,
      instance;

  uiOptions.isSidebarVisible =  uiOptions.isFullScreen ? false : uiOptions.isSidebarVisible;

  instance = {
    element: internalMethods.getElement(options.element),
    brand: brand,
    libraries: [],
    items: [],
    sidebarItems: {},
    sidebarActions: sidebarActions,
    options: optionsList,
    actions: actions,
    extraActions: extraActions,
    floatingButtons: floatingButtons,
    uiOptions: uiOptions,
    permanentStatus: permanentStatus
  };

  filesFromDOM = internalMethods.extractFilesFromDOM(instance.element);
  librariesFromDOM = internalMethods.extractLibrariesFromDOM(instance.element);

  mixin(instance, EventEmitter.prototype);
  mixin(instance, instanceMethods);
  forEach(options.items, instance.addItem, instance);
  forEach(options.libraries, instance.addLibrary, instance);
  forEach(filesFromDOM, instance.addFile, instance);
  forEach(librariesFromDOM, instance.toggleLibrary, instance);

  // var readyEvent = global.document.createEvent('CustomEvent');
  // readyEvent.initCustomEvent('codebasket:ready', true, true, {
  //   codeBasket: instance
  // });
  //
  // global.dispatchEvent(readyEvent);

  return instance;
};

global.CodeBasket = CodeBasket;