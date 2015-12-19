'use strict';

var React = require('react'),
    CodeEditor;

CodeEditor = React.createClass({
  componentDidMount: function() {
  },
  render: function() {
    return (<div ref="editor" className="console-tabpage console-container-editor"></div>);
  }
});

module.exports = CodeEditor;