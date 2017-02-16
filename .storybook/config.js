import { configure } from '@kadira/storybook';

function loadStories() {
    require('../Stories/index.js');
    // You can require as many stories as you need.
}

configure(loadStories, module);