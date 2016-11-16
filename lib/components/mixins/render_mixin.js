'use strict';

var React = require('react');

module.exports = {
  renderNavButton: function renderNavButton(item, index) {
    return <span ref={item.ref} title={item.title} className={'navbar-button icon ' + item.icon} key={index} onClick={item.action}></span>;
  },
  renderOption: function renderOption(item, index) {
    if (item.action) {
      return (
        <li key={index} onClick={item.action} title={item.title}>
          <i className={'icon ' + item.icon}></i>
          {item.title}
        </li>
      );
    }
    else {
      return (
        <li key={index} onClick={item.action} title={item.title}>
          <a rel="noopener noreferrer" target={item.target || null} href={item.href || null}>
            <i className={'icon ' + item.icon}></i>
            {item.title}
          </a>
        </li>
      );
    }
  }
};