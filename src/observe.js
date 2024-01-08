import { components, deferredComponents } from './components.js';
import { factory } from './factory.js';
import { run as loaderRun, destroy } from './run.js';

window.ncObservers = window.ncObservers || {};
export const observe = (element = window.document, prefix = '', excludeSelectors = '') => {
  const ns = prefix || 'class';
  if (!window.ncObservers[ns]) {
    window.ncObservers[ns] = new MutationObserver(
      (mutations) => mutations.forEach((mutation) => {
        const nodeActions = {
          removedNodes: destroy,
          addedNodes: loaderRun
        };
        Object.keys(nodeActions).forEach((type) => {
          if (mutation[type].length > 0) {
            Array.prototype.slice.call(mutation[type])
              .forEach((node) => {
                if (node.querySelector) {
                  // run or destroy etc.
                  nodeActions[type](node, prefix, excludeSelectors);
                }
              });
          }
        });
      })
    );

    window.ncObservers[ns].observe(element, {
      subtree: true,
      childList: true
    });
  }
};

export const domReady = (event = 'DOMContentLoaded', element = window.document, prefix = '', excludeSelectors = '') => {
  const ready = document.readyState === 'complete'
    || document.readyState === 'interactive';
  if (!ready) {
    window.addEventListener(event, () => {
      loaderRun(element, prefix, excludeSelectors);
    });
  } else {
    loaderRun(element, prefix, excludeSelectors);
  }
};

export const register = (newComponents) => {
  Object.keys(newComponents).forEach((name) => {
    components[name] = newComponents[name];
    if (deferredComponents[name]) {
      deferredComponents[name].forEach(({ element }) => factory(name, element));
      delete deferredComponents[name];
    }
  });
};
