const fs = require('fs');
const glob = require('glob');
const parse = require('typescript-react-intl').default;

const DEFAULT_MESSAGE_PATH = './defaultMessages.json';

const matches = glob.sync('{,!(node_modules)/**/}*.tsx');

const defaultMassages = matches
  .map((match) => {
    const contents = fs.readFileSync(match).toString();
    return parse(contents);
  })
  .reduce((acc, trans) => {
    trans.forEach(({ id, defaultMessage }) => {
      if (acc[id] && acc[id] !== defaultMessage) {
        throw Error(`Got 2 different defaultMessages for id: ${id}`);
      } else {
        acc[id] = defaultMessage;
      }
    });
    return acc;
  }, {});

fs.writeFileSync(DEFAULT_MESSAGE_PATH, JSON.stringify(defaultMassages, null, 2));

console.log(`Default messages written to ${DEFAULT_MESSAGE_PATH}`);
