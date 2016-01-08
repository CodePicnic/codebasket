'use strict';

var React = require('react');

module.exports = React.createClass({
  getDefaultProps: function() {
    return { isChild: false };
  },
  getInitialState: function() {
    return { isCollapsed: true };
  },
  toggleCollapse: function() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  },
  render: function() {
    var itemKey = this.props.itemKey,
        itemValue = this.props.itemValue,
        itemType = internalMethods.detectType(itemValue),
        isChild = this.props.isChild,
        isObject = (itemType === 'object'),
        isArray = (itemType === 'array'),
        isLargeString = (itemType === 'string' && itemValue.length > 255),
        willCollapse = (isObject || isArray || isLargeString),
        collapsedClass = (this.state.isCollapsed ? 'message-object-item-collapsed' : 'message-object-item-extended');

    if (willCollapse) {
      return (
        <li className={'message-object-item ' + collapsedClass}>
          <strong className="message-key" onClick={this.toggleCollapse}>{itemKey + ':'}</strong>
          <MessagePolymorphic content={itemValue} isChild={isChild} />
        </li>
      );
    }
    else {
      return (
        <li className={'message-object-item'}>
          <strong className="message-key">{itemKey + ':'}</strong>
          <MessagePolymorphic isChild={isChild} content={itemValue} />
        </li>
      );
    }
  }
});

var internalMethods = require('../internal_methods'),
    MessagePolymorphic = require('./message_polymorphic');