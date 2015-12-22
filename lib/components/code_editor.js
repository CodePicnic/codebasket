'use strict';

var React = require('react'),
    ace = require('brace'),
    CodeEditor;

require('brace/theme/tomorrow');

CodeEditor = React.createClass({
  getInitialState: function() {
    return { initialized: false };
  },
  componentDidMount: function() {
    var UndoManager = ace.UndoManager;

    this.editor = ace.edit(this.refs.editor);
    this.editor.setTheme('ace/theme/tomorrow');
    this.editor.setOptions({ enableBasicAutocompletion: true });
    this.editor.setShowPrintMargin(false);
    this.editor.resize();

    this.editor.on('change', function() {});
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