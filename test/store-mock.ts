var localStorageMock = (function() {
  var store = {};

  return {
    // @ts-ignore
    getItem: function(key: string) {
      // @ts-ignore
      return store[key] || null;
    },
    // @ts-ignore
    setItem: function(key: string, value: any) {
      // @ts-ignore
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
