import { instances } from './components.js';
import { factory } from './factory.js';

const scan = (element = window.document, prefix = '', excludeSelectors = '') => {
  const attrSelector = prefix ? `[class^="${prefix}"]` : '[class]:not([class=""]';
  const selectors = excludeSelectors ? `${attrSelector}:not(${excludeSelectors})` : attrSelector;
  const nodes = Array.prototype.slice.call(element.querySelectorAll(selectors));
  if (element.classList.length > 0) {
    nodes.push(element);
  }
  return nodes;
};

const getComponentNames = (node, prefix) => {
  const classNames = node.classList;
  return prefix ? classNames.filter((n) => n.startsWith(prefix)) : classNames[0];
};

export const run = (element = window.document, prefix = '', excludeSelectors = '') =>
  scan(element, prefix, excludeSelectors).forEach(
    (node) => setTimeout(() => {
      if (!node.initialized) {
        node.initialized = true;
        const componentNames = getComponentNames(node, prefix);
        componentNames.forEach((name) =>
          factory(name, node));
      }
    })
  );

export const runComponent = (name, element = window.document, prefix = '', excludeSelectors = '') =>
  scan(element, prefix, excludeSelectors)
    .forEach((node) => setTimeout(() =>
      factory(name, node)));

export const destroy = (element = window.document, prefix = '', excludeSelectors = '') =>
  scan(element, prefix, excludeSelectors).forEach(
    (node) => setTimeout(() => {
      const componentNames = getComponentNames(node, prefix);
      componentNames.forEach((name) => {
        if (instances[name]) {
          instances[name].forEach((instance) => {
            if (node.uuid === instance.el.uuid && node.initialized && instance.disconnectedCallback) {
              instance.disconnectedCallback();
            }
          });
        }
      });
    })
  );
