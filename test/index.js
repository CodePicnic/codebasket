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
  }];

  it('should throw an error if element is not defined', function() {
    expect(function() {
      CodeBasket.create({});
    }).toThrow('You need to set a container element');
  });

  it('should create a UI', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test'
    });

    codeBasket.render();

    expect(codeBasket).toExist();
  });

  it('should create an options list', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      options: options
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.console-options > *').length).toEqual(options.length);
  });

  it('should create tabs', function() {
    var items = [{
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
        }];

    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      toolbarOptions: [{
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
      options: options
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.console-tabs .console-tab').length).toEqual(codeBasket.items.filter(function(item) { return item.isVisible === true }).length);
  });
  //   it('should respond to click event', function() {
  //     google.maps.event.trigger(mapWithEvents.map, 'click', {
  //       latLng : new google.maps.LatLng(-12.0433, -77.0283)
  //     });
  //
  //     expect(callbacks.onclick).toHaveBeenCalled();
  //     // expect(mapWithEvents.markers.length).toEqual(1);
  //   });
  //
  //   afterEach(function() {
  //     document.getElementById('map-with-events').innerHTML = '';
  //     mapWithEvents = null;
  //   });
  // });
});