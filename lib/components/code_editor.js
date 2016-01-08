'use strict';

var React = require('react'),
    find = require('lodash/collection/find'),
    ace = global.ace,
    CodeEditor;

CodeEditor = React.createClass({
  getInitialState: function() {
    return { initialized: false };
  },
  componentDidMount: function() {
    var UndoManager = ace.UndoManager,
        app = this.props.app,
        self = this;

    var editor = ace.edit(this.refs.editor);
    editor.setTheme('ace/theme/tomorrow');
    editor.setOptions({ enableBasicAutocompletion: true });
    editor.setShowPrintMargin(false);
    editor.resize();

    editor.on('change', function() {
      var item = find(app.items, function(item) {
        return item.type === 'file' && item.session === editor.session;
      });

      item.hasChanged = true;

      var changeEvent = new global.CustomEvent('codebasket:change', {
        detail: {
          codeBasket: app,
          item: item
        }
      });

      global.dispatchEvent(changeEvent);
    });

    editor.on('changeSession', function(changeSession) {
      var item = find(app.items, function(item) {
        return item.type === 'file' && item.session === changeSession.session;
      });

      var changeSessionEvent = new global.CustomEvent('codebasket:changesession', {
        detail: {
          codeBasket: app,
          item: item,
          session: changeSession.session,
          oldSession: changeSession.oldSession
        }
      });

      global.dispatchEvent(changeSessionEvent);
    });

    this.editor = editor;
  },
  componentDidUpdate: function() {
    if (this.editor && this.props.isActive) {
      this.editor.resize();
    }
  },
  render: function() {
    var isActive = this.props.isActive,
        app = this.props.app;

    app.editor = (app.editor || this.editor);

    return (
      <div ref="editor" className={'console-tabpage console-editor ace_editor ace-tomorrow' + (isActive ? ' active' : '')}>
      </div>
    );
  }
});

module.exports = CodeEditor;