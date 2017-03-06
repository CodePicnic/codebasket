'use strict';

var React = require('react');

module.exports = {
  renderNavButton: function renderNavButton(item, index) {
    return <span ref={item.ref} title={item.title} className={'navbar-button icon ' + item.icon} key={index} onClick={item.action}></span>;
  },
  renderOption: function renderOption(item, index) {
    var optionIdentifier = item.id || item.title.toLowerCase().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '-');

    if (item.action) {
      return (
        <li key={index} onClick={item.action} title={item.title} className={'codebasket-option-' + optionIdentifier}>
          <i className={'icon ' + item.icon}></i>
          {item.title}
        </li>
      );
    }
    else {
      return (
        <li key={index} onClick={item.action} title={item.title} className={'codebasket-option-' + optionIdentifier}>
          <a rel="noopener noreferrer" target={item.target || null} href={item.href || null}>
            <i className={'icon ' + item.icon}></i>
            {item.title}
          </a>
        </li>
      );
    }
  }
};