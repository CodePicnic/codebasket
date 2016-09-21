'use strict';

var React = require('react'),
    MessageObjectItem = require('./message_object_item');

module.exports = React.createClass({
  render: function() {
    var content = this.props.content,
        items;

    items = Object.keys(content).map(function(key) {
      return <MessageObjectItem key={'object-item-' + key} itemKey={key} itemValue={content[key]} isChild={true} />;
    });

    return (
      <ul className={'message message-object ' + (this.props.isChild ? 'message-value' : '')}>
        {items}
      </ul>
    );
  }
});