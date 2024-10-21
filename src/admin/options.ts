import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';
import Inventory from 'src/models/inventory.model.js';
import User from 'src/models/user.model.js';
import Item from 'src/models/item.model.js';
import Recipe from 'src/models/recipe.model.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/',
  resources: [Inventory, User, Item, Recipe],
  databases: [],
};

export default options;
