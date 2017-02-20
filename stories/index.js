import React from "react";
import { action, storiesOf } from "@kadira/storybook";

//import { host } from "storybook-host";
//import { number, withKnobs } from "@kadira/storybook-addon-knobs";
import withReadme from "storybook-readme/with-readme";
import TableReadme from "../README.md";


import { DumbTable } from '../dist';
import { fakeData } from './fakeData';
import '../dist/style.css';


const stories = storiesOf('React-dumb-table', module);

// stories.addDecorator( withKnobs );
// stories.addDecorator( host( {
//     title:        'React-dumb-table in the container',
//     align:        'top',
//     height:       '60%',
//     width:        '100%',
//     mobXDevTools: false
// } ) );

stories.add('DumbTable', withReadme(TableReadme, () => {
    return (
        <TableController/>
    )
}));




class TableController extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            limit: 25,
            offset: 0,
            selected:[],
            orderBy: "first_name",
            orderDirection: "ASC",
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
                        className="dumbTable__contentCell">{ new Date( Number(row.birthday)*1000 ).toLocaleDateString( "ru-RU" ) }</div>
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

    getContextMenu(row, index, key) {
        this.setState({selected:[index]})
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

    orderChangeHandler(orderBy, orderDirection){
        this.setState({ orderBy, orderDirection });
    }

    cellClickHandler(row, index, column){
        this.setState({selected:[index]})
    }

    sort=(a, b)=> {
        let f = a[ this.state.orderBy ];
        let s = b[ this.state.orderBy ];

        if ( this.state.orderDirection === "ASC" ) {
            if (f > s){
                return 1
            } else {
                return -1
            }
        } else {
            if (f < s){
                return 1
            } else {
                return -1
            }
        }
    };

    offsetChangeHandler=(offset)=>{
        this.setState({offset})
    };


    render() {
        let data = fakeData.sort(this.sort).slice(this.state.offset, this.state.offset + this.state.limit);

        return (
            <DumbTable
                data={data}
                columns={this.getColumns()}
                selectedRowIndexes={this.state.selected}
                cellClickHandler={this.cellClickHandler.bind(this)}


                orderBy={this.state.orderBy}
                orderDirection={this.state.orderDirection}
                orderChangeHandler={this.orderChangeHandler.bind(this)}

                offsetChangeHandler={this.offsetChangeHandler}
                offset={this.state.offset}
                limit={this.state.limit}
                limitsList={[ 10, 25, 50, 100 ]}
                total={fakeData.length}
                limitSelectorHandler={this.changeLimit.bind(this)}

                contextMenuItems={this.getContextMenu.bind(this)}
            />
        )
    }


}