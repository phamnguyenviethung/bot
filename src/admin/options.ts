import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';
import Inventory from 'src/models/inventory.model.js';
import User from 'src/models/user.model.js';
import Item from 'src/models/item.model.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/',
  resources: [Inventory, User, Item],
  databases: [],
};

export default options;
