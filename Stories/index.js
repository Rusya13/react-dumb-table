import React from "react";
import { action, storiesOf } from "@kadira/storybook";
import { host } from "storybook-host";
import { number, withKnobs } from "@kadira/storybook-addon-knobs";
import withReadme from "storybook-readme/with-readme";
import TableReadme from "../README.md";


import { SimpleTable } from "../src/index.js";
import { fakeData } from "../Examples/fakeData";
import "../lib/style.css";


const stories = storiesOf( 'React-dumb-table', module );

stories.addDecorator( withKnobs );
stories.addDecorator( host( {
    title:        'React-dumb-table in the container',
    align:        'top',
    height:       '50%',
    width:        '90%',
    mobXDevTools: false
} ) );

stories.add( 'Simple Table', withReadme( TableReadme, () => {

    let columns = [
        {
            name:  "First Name",
            width: 25,
            key:   "first_name",
            //sortKey: "name"
        }, {
            name:  "Last Name",
            width: 25,
            key:   "last_name"
        }, {
            name:  "Gender",
            width: 25,
            key:   "gender"
        }, {
            name:  "IP-address",
            width: 25,
            key:   "ip_address"
        }, {
            name:  "email",
            width: 25,
            key:   "email",
            type:  "email"
        }
    ];

    function setContextMenu() {
        return (
            [
                { title: "Edit row", onClickHandler: action( 'edit row' ) },
                { title: "Delete row", onClickHandler: action( ('delete row') ) },
                { type: "divider" },
                { title: "Create new", onClickHandler: action( 'create new row' ) },
            ]
        )
    }


    return (

        <SimpleTable
            data={fakeData}
            columns={columns}
            limitSelectorHandler={action( 'limit-change' )}
            offsetChangeHandler={action( "offset-change" )}
            cellClickHandler={action( "cell-click" )}
            offset={number( "offset", 10 )}
            limit={number( "limit", 25 )}
            contextMenuItems={setContextMenu}
        />


    )

} ) )
