/**
 * The InputComponent lets you search through configured indexes.
 *
 * @type {InputComponent}
 */
EasySearch.InputComponent = class InputComponent extends BaseComponent {
  /**
   * Setup input onCreated.
   */
  onCreated() {
    let cursorHandle;

    super.onCreated(...arguments);

    this.search(this.inputAttributes().value);

    // create a reactive dependency to the cursor
    Tracker.autorun(() => {
      this.eachIndex((index, name) => {
        if (cursorHandle) {
          cursorHandle.stop();
        }

        cursorHandle = index.getComponentMethods(name).getCursor();
      });
    });

    this.debouncedSearch = _.debounce((searchString) => {
      searchString = searchString.trim();

      if (this.searchString !== searchString) {
        this.searchString = searchString;

        this.eachIndex((index, name) => {
          index.getComponentDict(name).set('currentPage', 1);
        });

        this.search(searchString);
      }

    }, this.options.timeout);
  }

  /**
   * Event map.
   *
   * @returns {Object}
   */
  events() {
    return [{
      'keyup input' : function (e) {
        if ('enter' == this.getData().event && e.keyCode != 13) {
          return;
        }

        this.debouncedSearch($(e.target).val());
      }
    }];
  }

  /**
   * Return the attributes to set on the input (class, id).
   *
   * @returns {Object}
   */
  inputAttributes() {
    return _.defaults({}, this.getData().attributes, InputComponent.defaultAttributes);
  }

  /**
   * Return the default attributes.
   *
   * @returns {Object}
   */
  static get defaultAttributes() {
    return {
      type: 'text',
      value: ''
    };
  }

  /**
   * Return the default options.
   *
   * @returns {Object}
   */
  get defaultOptions() {
    return {
      timeout: 50
    };
  }
};

EasySearch.InputComponent.register('EasySearch.Input');