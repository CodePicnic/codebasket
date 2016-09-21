var React = require('react');

module.exports = {
  renderNavButton: function renderNavButton(item, index) {
    return <span className={'navbar-button icon ' + item.icon} key={index}></span>;
  },
  renderOption: function renderOption(item, index) {
    return (
      <span key={index}>
        <i className={'icon ' + item.icon}></i>
        {item.text}
      </span>
    );
  }
};