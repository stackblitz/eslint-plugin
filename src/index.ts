import { recommended } from './configs/recommended';

const { name, version } = require('../package.json') as {
  name: string;
  version: string;
};

module.exports = {
  meta: {
    name,
    version,
  },
  configs: {
    recommended,
  },
};
