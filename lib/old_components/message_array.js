'use strict';

var React = require('react'),
    MessagePolymorphic = require('./message_polymorphic'),
    MessageArray;

MessageArray = React.createClass({
  render: function() {
    var content = this.props.content,
        items;

    items = content.map(function(item, index) {
      return (
        <li key={'array-item-' + index}>
          <MessagePolymorphic content={item} />
        </li>
      );
    });

    return (
      <ul className={'message message-array' + (this.props.isChild ? ' message-value' : '')}>
        {items}
      </ul>
    );
  }
});

module.exports = MessageArray;