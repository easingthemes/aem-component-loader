# @draganfilipovic/aem-component-loader

Description

[![Version](https://img.shields.io/npm/v/@draganfilipovic/aem-component-loader.svg)](https://npmjs.org/package/@draganfilipovic/aem-component-loader)
[![Build Status](https://github.com/easingthemes/aem-component-loader/workflows/CI/badge.svg?branch=main)](https://github.com/easingthemes/aem-component-loader/actions)
[![CodeQL Analysis](https://github.com/easingthemes/aem-component-loader/workflows/CodeQL/badge.svg?branch=main)](https://github.com/easingthemes/aem-component-loader/actions)
[![semver: semantic-release](https://img.shields.io/badge/semver-semantic--release-blue.svg)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Installation

```npm install @draganfilipovic/aem-component-loader```

**important!**

This module is not transpiled. If your project is excluding `node_modules` you will have to update regex to include this module.

Eg:

```javascript
// webpack babel-loader config
module.exports = {
  exclude: /node_modules\/(?!@draganfilipovic)/,
  loader: 'babel-loader',
  ...
};
```

Here we are excluding node_modules, except the ones under node_modules/@draganfilipovic/*


## Usage

1. Register component:
```javascript
register({ componentName: ComponentClass });
```
2. Initialize component
```javascript
runComponent('componentName');
```
or initialize all components
```javascript
run();
```
3. Bind component to DOM
```html
<div class="componentName"></div>
```

### Example

#### in the component file you should register your component

```javascript
import { register } from '@draganfilipovic/aem-component-loader';

class Text {
  ...
}
// register your component to be loaded
register({ text: Text });
```

#### At your main entry file you should run all registered components

```javascript
import {
  observe,
  run
} from '@draganfilipovic/aem-component-loader';

// Run all registered component
run();
// Optional: Use observe to initialize new components which  are added to the DOM after initial run.
observe();
```

## API and examples

This version uses standalone functions to allow tree shaking and to only use necessary parts.


### adding it to HTML

Adding one component

```
<div class="Component1"></div>
```


Adding more than one component

```
<div class="prefix-Component1, prefix-Component2"></div>
```

### register

This method will register components constructor in loaderComponents
You can register individual component, or list

#### Parameters

```
/**
 * Constant with a object that contain collection of components classes.
 * 
 * @param {object} newComponents - Components collection { name: definition }
 */
  const register = (newComponents) => {}
```

#### Examples

```javascript

import { register } from '@netcentric/component-loader';
import { title } from 'components/title';
import { text } from 'components/text';

// Add 2 components named title, and text
register({ title, text });

```
Or you can register several components based on proper named exports

```javascript

import { register } from '@netcentric/component-loader';
import * as components from 'components';

// register all components exported as proper named exports on components/index.js

register({ components });

```

### run

This will run the loader on previously registered components.

#### Parameters

```
/**
 *  Run the loader on a element to get all attributes that corresponds to a component
 *  @param {HTMLElement} [element] root element
 *  @param {string} [prefix] CSS class name prefix
 */
  const run = (element = window.document, prefix = 'prefix') => {}
```

#### Examples

```javascript

import {
  register,
  run
} from '@draganfilipovic/aem-component-loader';

// eg components
import { title } from 'components/title';
import { text } from 'components/text';

// Add 2 components named title, and text
register({ title, text });
// then you run so it will create if any HTMLelement with a default attribute have any component to start
run();

// Or load components only on a specific element
const main = document.querySelector('main');
run(main);
```

### components

Here is just a constant to store the available constructors (functions or classes) of components.
We store it on its own file so it can be imported into separated files and without having to import the other components logic.

If you want to access all components constructors you can just import it in any file like:

```javascript

import { components } from '@draganfilipovic/aem-component-loader';

```

### instances

This object will store all instances of components separated by [className][instanceId].
We store it on its own file, so it can be imported into separated files and without having to import the other components logic.

If you want to access all the instances of components you can just import it in any file like:

```javascript

import { instances } from '@draganfilipovic/aem-component-loader';

const howManyTitles = instances.title.length;

// eg of querying title components by uuid
const getTitleByUUID = (uuid) => instances.title.filter(instance => instance.el.uuid === uuid);
const mytitle = getTitleByUUID('a8c405b5-1928-46ed-afa1-5a0a3f4dde6c');

```
