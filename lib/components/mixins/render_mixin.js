var React = require('react');

module.exports = {
  renderNavButton: function renderNavButton(item, index) {
    return <span ref={item.ref} className={'navbar-button icon ' + item.icon} key={index} onClick={item.action}></span>;
  },
  renderOption: function renderOption(item, index) {
    return (
      <span key={index} onClick={item.action}>
        <i className={'icon ' + item.icon}></i>
        {item.title}
      </span>
    );
  }
};