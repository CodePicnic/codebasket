'use strict';

var React = require('react'),
    Brand;

Brand = React.createClass({
  render: function() {
    return (
      <a className="console-brand" href={this.props.brand.href} target="_blank" style={{ width: this.props.width + 'px' }}>
        <img className="console-brand-image" src={this.props.brand.image} />
      </a>
    );
  }
});

module.exports = Brand;