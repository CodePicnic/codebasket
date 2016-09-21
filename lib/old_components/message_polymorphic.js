'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    var content = this.props.content,
        messageType = internalMethods.detectType(content),
        output;

    switch (messageType) {
      case 'array':
        output = <MessageArray content={content} isChild={this.props.isChild} />;
        break;
      case 'null':
        output = <pre className="message message-null">null</pre>;
        break;
      case 'undefined':
        output = <pre className="message message-undefined">undefined</pre>;
        break;
      case 'object':
        output = <MessageObject content={content} isChild={this.props.isChild} />;
        break;
      case 'string':
        output = <pre className={'message message-string' + (this.props.isChild ? ' message-value' : '')}>{'"' + content + '"'}</pre>;
        break;
      case 'number':
        output = <pre className="message message-number">{content}</pre>;
        break;
      case 'boolean':
        output = <pre className="message message-boolean">{content ? 'true' : 'false'}</pre>;
        break;
      default:
        output = <pre className="message">{content}</pre>;
        break;
    }

    return output;
  }
});

var MessageArray = require('./message_array'),
    MessageObject = require('./message_object'),
    internalMethods = require('../internal_methods');