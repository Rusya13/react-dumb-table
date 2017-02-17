import React from "react";
import { action, storiesOf } from "@kadira/storybook";

import { host } from "storybook-host";
//import { number, withKnobs } from "@kadira/storybook-addon-knobs";
import withReadme from "storybook-readme/with-readme";
import TableReadme from "../README.md";


import { SimpleTable } from "../src/index.js";
import { fakeData } from "../Examples/fakeData";
import "../lib/style.css";


const stories = storiesOf( 'React-dumb-table', module );

//stories.addDecorator( withKnobs );
stories.addDecorator( host( {
    title:        'React-dumb-table in the container',
    align:        'top',
    height:       '60%',
    width:        '100%',
    mobXDevTools: false
} ) );


class TableController extends React.Component {

    constructor( props ) {
        super( props )

        this.state = {
            limit: 10
        }

    }

    getColumns() {
        return [
            {
                name:  "First Name",
                width: 15,
                key:   "first_name",
                //sortKey: "name"
            }, {
                name:  "Last Name",
                width: 15,
                key:   "last_name"
            }, {
                name:  "Gender",
                width: 10,
                key:   "gender"
            }, {
                name:  "IP-address",
                width: 15,
                key:   "ip_address"
            }, {
                name:  "Email",
                width: 25,
                key:   "email",
                type:  "email"
            }, {
                name:   "Birthday",
                width:  15,
                key:    "birthday",
                type:   "date",
                render: ( row, index, columns ) => {
                    return <div
                        className="simpleTable__contentCell">{ new Date( row.birthday ).toLocaleDateString( "ru-RU" ) }</div>
                }
            }, {
                name:   "Url",
                width:  25,
                key:    "link",
                type:   "link",
                link:   "link",
                target: "_blank"
            }
        ]
    }

    getContextMenu() {
        return (
            [
                { title: "Edit row", onClickHandler: action( 'edit row' ) },
                { title: "Delete row", onClickHandler: action( ('delete row') ) },
                { type: "divider" },
                { title: "Create new", onClickHandler: action( 'create new row' ) },
            ]
        )
    }

    changeLimit( newLimit ) {
        console.log( "index changeLimit", newLimit );
        this.setState( { limit: newLimit } )
    }

    render() {
        return (
            <SimpleTable
                data={fakeData}
                columns={this.getColumns()}
                limitSelectorHandler={this.changeLimit.bind(this)}
                offsetChangeHandler={action( "offset-change" )}
                cellClickHandler={action( "cell-click" )}
                offset={0}
                limit={this.state.limit}
                limitsList={[ 10, 25, 50, 100 ]}
                contextMenuItems={this.getContextMenu}
            />
        )
    }


}


stories.add( 'Simple Table', withReadme( TableReadme, () => {
    return (
        <TableController/>
    )
} ) );
