import { configure } from '@storybook/react';

const req = require.context('../', true, /\.story\.tsx$/)
console.log(req);
function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
