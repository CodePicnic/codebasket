'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    size = require('lodash/collection/size');

module.exports = {
  toggleSidebar: function() {
    var instance = this.props.instance;

    if (instance.view) {
      instance.view.setState({ isSidebarVisible: !instance.view.state.isSidebarVisible });
    }
  },
  toggleOptionsList: function() {
    this.setState({ isOptionsListVisible: !this.state.isOptionsListVisible });
  },
  toggleAside: function() {
    this.setState({ isAsideVisible: !this.state.isAsideVisible });
  },
  toggleLibrariesList: function() {
    this.setState({ isLibrariesListVisible: !this.state.isLibrariesListVisible });
  },
  toggleLibrary: function(url) {
    var instance = this.props.instance;

    instance.toggleLibrary(url);
    this.setState({ libraries: instance.libraries });
  },
  renderAddLibraryButton: function() {
    return (CodeBasket.libraries && size(CodeBasket.libraries)) > 0 ? this.renderNavButton({ icon: 'icon-add', action: this.toggleLibrariesList }) : undefined;
  },
  renderOptionsButton: function() {
    var instance = this.props.instance;

    return (instance.options && instance.options.length > 0) ? this.renderNavButton({ icon: 'icon-cog', action: this.toggleOptionsList }) : undefined;
  },
  renderInfoButton: function() {
    var instance = this.props.instance;

    return instance.info ? this.renderNavButton({ icon: 'icon-info', action: this.toggleAside }) : undefined;
  },
  renderLibrary: function(versions, libraryName) {
    var instance = this.props.instance,
        versions = map(versions, function(url, version) {
          return (
            <dd className="codebasket-libraries-list-value" key={libraryName.toLowerCase() + '-' + version}>
              <label>
                <input type="checkbox" checked={instance.hasLibrary(url)} onChange={this.toggleLibrary.bind(this, url)} />
                {libraryName + ' ' + version}
              </label>
            </dd>
          );
        }, this);

    return (
      <dl className="codebasket-libraries-list" key={libraryName}>
        <dt className="codebasket-libraries-list-title">{libraryName}</dt>
        {versions}
      </dl>
    );
  },
  renderLibrariesList: function(libraries) {
    return map(libraries, this.renderLibrary, this);
  }
};