echo $NPMRC > ~/.npmrc
npm install
npm build
npm test
npm publish