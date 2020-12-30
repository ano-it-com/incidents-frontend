function install(Vue, options) {
  const name = (options && options.name) || 'transferDom';

  // Define the directive
  Vue.directive(name, {
    inserted(el, bindings) {
      // default append to <body>
      const container = bindings.arg
        ? document.getElementById(bindings.arg)
        : document.body;

      if (container) {
        /* eslint no-unused-expressions: 0 */
        (bindings.modifiers.prepend && container.firstChild)
          ? container.insertBefore(el, container.firstChild) // top of target
          : container.appendChild(el); // bottom of target
      } else {
        /* eslint prefer-template: 0 */
        console.warn(
          'v-' + name + ' target element id "' + bindings.arg + '" not found.',
        );
      }
    },
    unbind(el) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
  });
}

export default { install };
