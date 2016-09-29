'use strict';

var find = require('lodash/collection/find');

module.exports = {
  onChangeEditor: function() {
    var editor = this.editor,
        item = find(this.props.instance.items, function(item) {
          return item.type === 'file' && item.session === editor.session;
        });

    item.hasChanged = true;

    var changeEvent = global.document.createEvent('CustomEvent');
    changeEvent.initCustomEvent('codebasket:change', true, true, {
      codeBasket: this.props.instance,
      item: item
    });

    global.dispatchEvent(changeEvent);
  },
  onChangeSessionEditor: function(event) {
    var item = find(this.props.instance.items, function(item) {
      return item.type === 'file' && item.session === event.session;
    });

    var changeSessionEvent = global.document.createEvent('CustomEvent');
    changeSessionEvent.initCustomEvent('codebasket:changesession', true, true, {
      codeBasket: this.props.instance,
      item: item,
      session: event.session,
      newSession: event.session,
      oldSession: event.oldSession
    });

    global.dispatchEvent(changeSessionEvent);
  }
};