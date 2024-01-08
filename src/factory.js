import { components, instances, deferredComponents } from './components.js';

/**
 * Create a component and pass parameters if set
 */

const create = (Component, name, el) => {
  try {
    const instance = new Component(el, name);
    return instance;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`${name}(${el.uuid}) ERROR:`, el, error);
    return error;
  }
};

/**
 * Factory by a component name and node
 * Removed this feature from run.js function into its own function for separate use
 */
export const factory = (name, element) => {
  // if there is a component available with the name
  const component = components[name];

  if (component) {
    if (!instances[name]) {
      instances[name] = [];
    }
    // create a unique ID for the component + node
    element.uuid = window.crypto.randomUUID();
    // add to the active collection using a unique ID
    instances[name].push(
      create(
        component, // Component Class
        name, // Component Name
        element // Node
      )
    );
    return null;
  }
  // no component was found
  deferredComponents[name] = deferredComponents[name] || [];
  deferredComponents[name].push({ element });
  // eslint-disable-next-line no-console
  return console.warn(`Deferring initialisation of Component because factory cannot find a class for "${name}"`);
};
