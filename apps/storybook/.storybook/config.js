import { configure } from '@storybook/react';

const req = require.context('../', true, /\.story\.tsx$/)
function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
