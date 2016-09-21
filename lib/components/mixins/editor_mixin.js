module.exports = {
  onChangeEditor: function() {
    var item = find(this.props.items, function(item) {
      return item.type === 'file' && item.session === editor.session;
    });

    item.hasChanged = true;

    this.props.instance.emit('change', { codeBasket: this.props.instance, item: item });

    // trigger change event

    // var changeEvent = global.document.createEvent('CustomEvent');
    // changeEvent.initCustomEvent('codebasket:change', true, true, {
    //   codeBasket: app,
    //   item: item
    // });
    //
    // global.dispatchEvent(changeEvent);
  },
  onChangeSessionEditor: function(event) {
    var item = find(this.props.items, function(item) {
      return item.type === 'file' && item.session === changeSession.session;
    });

    this.props.instance.emit('changesession', {
      codeBasket: this.props.instance,
      item: item,
      session: event.session,
      newSession: event.session,
      oldSession: event.oldSession
    });

    // trigger changesession event

    // var changeSessionEvent = global.document.createEvent('CustomEvent');
    // changeSessionEvent.initCustomEvent('codebasket:changesession', true, true, {
    //   codeBasket: app,
    //   item: item,
    //   session: changeSession.session,
    //   newSession: changeSession.session,
    //   oldSession: changeSession.oldSession
    // });
    //
    // global.dispatchEvent(changeSessionEvent);
  }
};