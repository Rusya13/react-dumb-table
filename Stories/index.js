import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';
import { SimpleTable } from '../src/index.js';
import {fakeData} from '../Examples/fakeData';
import '../lib/style.css';



const stories = storiesOf('React-dumb-table', module);

stories.addDecorator(withKnobs);

stories.add('Simple Table', () => {

    let columns = [
        {
            name:   "First Name",
            width:   25,
            key:     "first_name",
            //sortKey: "name"
        }, {
            name: "Last Name",
            width: 25,
            key:   "last_name"
        }, {
            name: "Gender",
            width: 25,
            key:   "gender"
        }, {
            name: "IP-address",
            width: 25,
            key:   "ip_address"
        }, {
            name: "email",
            width: 25,
            key:   "email"
        }
    ];

    let contextMenu = [
        { title: "Edit row", onClickHandler: () => console.log( "index action menu click" ) },
        { title: "Delete row", onClickHandler: () => console.log( "index action menu click" ) },
        { type:"divider" },
        { title: "Create new", onClickHandler: () => console.log( "index action menu click" ) },
    ];

    return (

        <SimpleTable
            data={fakeData}
            columns={columns}
            limitSelectorHandler={action('limit-change')}
            offsetChangeHandler={action("offset-change")}
            cellClickHandler={action("cell-click")}
            offset={number("offset", 10)}
            limit={number("limit", 25)}
        />


    )
})
