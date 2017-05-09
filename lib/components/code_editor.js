'use strict';

var React = require('react'),
    find = require('lodash/collection/find'),
    some = require('lodash/collection/some'),
    renderMixin = require('./mixins/render_mixin'),
    editorMixin = require('./mixins/editor_mixin'),
    ace = global.ace,
    CodeEditor;

CodeEditor = React.createClass({
  mixins: [renderMixin, editorMixin],
  getInitialState: function() {
    return { initialized: false };
  },
  getDefaultProps: function() {},
  componentDidMount: function() {
    var UndoManager = ace.UndoManager,
        editor;

    editor = ace.edit(this.refs.editor);
    editor.$blockScrolling = Infinity;
    editor.setTheme(this.props.instance.uiOptions.editorTheme);
    editor.setOptions({ enableBasicAutocompletion: true });
    editor.setShowPrintMargin(false);
    editor.resize();

    editor.on('change', this.onChangeEditor);
    editor.on('changeSession', this.onChangeSessionEditor);

    this.editor = editor;
  },
  componentDidUpdate: function() {
    var instance = this.props.instance;

    if (this.editor && this.props.isActive) {
      this.editor.resize();
    }

    // don't attach the editor to instance because maybe we'll add more editors to a single instance
    if (this.editor) {
      if (instance.editors.indexOf(this.editor) === -1) {
        instance.editors.push(this.editor);
      }
      else {
        instance.editors[instance.editors.indexOf(this.editor)] = this.editor;
      }
    }
    //instance.editor = (instance.editor || this.editor);
  },
  render: function() {
    var instance = this.props.instance;

    // don't attach the editor to instance because maybe we'll add more editors to a single instance
    if (this.editor) {
      if (instance.editors.indexOf(this.editor) === -1) {
        instance.editors.push(this.editor);
      }
      else {
        instance.editors[instance.editors.indexOf(this.editor)] = this.editor;
      }
    }

    return (
      <div ref="editor" className="codebasket-editor ace_editor ace-tomorrow">
      </div>
    );
  }
});

module.exports = CodeEditor;