'use strict';

var React = require('react');

module.exports = {
  renderNavButton: function renderNavButton(item, index) {
    return <span ref={item.ref} title={item.title} className={'navbar-button icon ' + item.icon} key={index} onClick={item.action}></span>;
  },
  renderOption: function renderOption(item, index) {
    return (
      <li key={index} onClick={item.action} title={item.title}>
        <i className={'icon ' + item.icon}></i>
        {item.title}
      </li>
    );
  }
};