var codeBasket;

describe('Creating a CodeBasket', function() {
  var options = [{
        title: 'Edit',
        icon: 'fa-pencil',
        href: '#'
      },
      {
        title: 'Fork',
        icon: 'fa-code-fork'
      },
      {
        title: 'Share',
        icon: 'fa-share-alt'
      }],
      sidebarActions = [{
        title: 'Add file',
        icon: 'with-plus fa-file',
        action: function() {}
      },{
        title: 'Add folder',
        icon: 'with-plus fa-folder',
        action: function() {}
      },{
        title: 'Reload',
        icon: 'fa-refresh',
        action: function() {}
      }],
      toolbarOptions = [{
        title: 'Full Screen View',
        icon: 'fa-expand',
        href: '#'
      },{
        title: 'Browser',
        icon: 'fa-globe',
        href: '#',
        action: function() {
          var browser = codeBasket.items.find(function(item) { return item.type === 'browser' });

          codeBasket.selectItem(browser);
        }
      }],
      items = [{
        location: 'http://jsfiddle.net/EVAXW/embedded/result/',
        title: 'JSFiddle',
        name: 'JSFiddle',
        isActive: true
      },
      {
        type: 'file',
        language: 'js',
        name: 'index.js',
        title: 'index.js',
        content: 'var content = {};'
      },
      {
        type: 'file',
        language: 'sass',
        name: 'index.scss',
        title: 'index.scss',
        content: 'body { background-color: $grey200; }'
      },
      {
        type: 'browser',
        location: 'http://jsfiddle.net/EVAXW/embedded/result/',
        title: 'JSFiddle',
        name: 'JSFiddle',
        isCloseable: true,
        isVisible: false
      }],
      brand = {
        href: 'https://codepicnic.com',
        image: 'codepicnic_logo.png'
      };

  it('should throw an error if element is not defined', function() {
    expect(function() {
      CodeBasket.create({});
    }).toThrow('You need to set a container element');
  });

  it('should create a UI', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket).toExist();
  });

  it('should create an options list', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.console-options > *').length).toEqual(options.length);
  });

  it('should create tabs', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      toolbarOptions: toolbarOptions,
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.console-tabs .console-tab').length).toEqual(codeBasket.items.filter(function(item) { return item.isVisible === true }).length);
  });

  it('should create a sidebar buttons list', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      sidebarActions: sidebarActions,
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.console-sidebar-actions > *').length).toEqual(sidebarActions.length);
  });

  it ('should support custom events', function() {
    function onReady() {
      console.log('codebasket:ready');
    }

    function onTabSelected() {
      console.log('codebasket:tabselected');
    }

    var spies = { onReady: onReady, onTabSelected: onTabSelected };

    expect.spyOn(spies, 'onReady').andCallThrough();
    expect.spyOn(spies, 'onTabSelected').andCallThrough();

    window.addEventListener('codebasket:ready', spies.onReady);
    window.addEventListener('codebasket:tabselected', spies.onTabSelected);

    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      sidebarActions: sidebarActions,
      options: options,
      brand: brand
    });

    codeBasket.render();
    expect(spies.onReady).toHaveBeenCalled();

    var secondTab = codeBasket.element.querySelector('.console-tab:nth-child(2)'),
        clickEvent = document.createEvent('MouseEvent');

    clickEvent.initMouseEvent('click', true, true, window, null);

    secondTab.dispatchEvent(clickEvent);
    expect(spies.onTabSelected).toHaveBeenCalled();
  });
});