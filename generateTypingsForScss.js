const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sass = require('node-sass');
const DtsCreator = require('typed-css-modules');

console.log('Generating typings for styles');

const creator = new DtsCreator({
  camelCase: 'dashes',
});

glob('{,!(node_modules)/**/}*.scss', (e, matches) => {
  if (e) {
    console.error('Error in glob()', e);
    process.exit(1);
  }

  matches.forEach((match) => {
    const content = sass
      .renderSync({
        file: match,
        importer: (url, prev, done) => {
          if (!url.startsWith('~')) {
            return null;
          }

          let filePath;
          try {
            filePath = require.resolve(url.replace('~', '') + '.scss');
          } catch (e) {
            filePath = require.resolve(url.replace('~', ''));
          }
          return { file: filePath };
        },
      })
      .css.toString();

    creator
      .create(match, content)
      .then((content) => {
        content.writeFile();
      })
      .catch((e) => {
        console.error(`Error when generating typings for ${match}`, e);
      });
  });
});
