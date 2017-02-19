import { configure, setAddon } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';


setOptions({
    name: 'React-dumb-table',
    url: 'https://github.com/kadirahq/storybook-addon-options',
    goFullScreen: false,
    showLeftPanel: true,
    showDownPanel: true,
    showSearchBox: false,
    downPanelInRight: true,
    sortStoriesByKind: false,
});


function loadStories() {
    require('../Stories');
    // You can require as many stories as you need.
}


configure(loadStories, module);