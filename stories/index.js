import React from "react";
import { action, storiesOf } from "@kadira/storybook";
//import { host } from "storybook-host";
//import { number, withKnobs } from "@kadira/storybook-addon-knobs";
import withReadme from "storybook-readme/with-readme";
import TableReadme from "../README.md";
import LoaderHOC from "./LoaderHOC";

import { DumbTable } from "../dist";
import "../dist/style.css";


const stories = storiesOf( 'React-dumb-table', module );

// stories.addDecorator( withKnobs );
// stories.addDecorator( host( {
//     title:        'React-dumb-table in the container',
//     align:        'top',
//     height:       '60%',
//     width:        '100%',
//     mobXDevTools: false
// } ) );

stories.add( 'DumbTable', withReadme( TableReadme, () => {
    return (
        <TableController/>
    )
} ) );


let Table = LoaderHOC( "data" )( DumbTable );


class Model{

    constructor(row){
        this.attributes = {};
        this.set(row)
    }

    get(key){
        return this.attributes[key]
    }

    set(o, v){
        if (typeof o === 'string' && v){
            this.attributes[o] = v
        } else {
            let keys = Object.keys(o);
            keys.forEach(key=>{
                this.attributes[key] = o[key]
            })
        }
    }

    get name(){
        return this.get("name")
    }

}


class TableController extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            limit:          25,
            offset:         0,
            selected:       [],
            orderBy:        "first_name",
            orderDirection: "ASC",
            data:           []
        }


    }

    componentDidMount() {
        fetch( "https://api.hh.ru/vacancies" ).then( res => res.json() )
        .then( json => {
            this.setState( { data: json.items.map(item=>{
                return new Model(item)
            }) } )
        } ).catch( e => {
            console.log( "Work e", e );
        } )
    }

    getColumns() {
        return []
        return [
            { name: "Название", key: "name", width: 20},
            {
                link: "url", name: "Ссылка", key: "url", width: 50, type: "link",

                target: "_blank"
            },
            { name: "Зарплата", key: "salary.from", width: 30 },
            { name: "Компания", key: "employer.name", width: 40 },
            { name: "Метро", key: "address.metro_stations[0].station_name", width: 40 }
        ]
    }

    getContextMenu( row, index, key ) {
        this.setState( { selected: [ index ] } );

        return (
            [
                { title: "Edit row", onClickHandler: (...args) => {
                    console.log('Edit Row Context Click', args);
                } },
                { title: "Delete row", onClickHandler: action( ('delete row') ) },
                { type: "divider" },
                { title: "Create new", onClickHandler: action( 'create new row' ) },
            ]
        )
    }

    getContextHeaderMenu( cell, index, key ) {
        return (
            [
                { title: "Header Action", onClickHandler: action( ('header action') ) }
            ]
        )
    }

    changeLimit( newLimit ) {
        console.log( "index changeLimit", newLimit );
        this.setState( { limit: newLimit } )
    }

    orderChangeHandler( orderBy, orderDirection ) {
        this.setState( { orderBy, orderDirection } );
    }

    cellClickHandler( row, index, column ) {
        this.setState( { selected: [ index ] } )
    }

    sort = ( a, b ) => {
        let f = a[ this.state.orderBy ];
        let s = b[ this.state.orderBy ];

        if ( this.state.orderDirection === "ASC" ) {
            if ( f > s ) {
                return 1
            } else {
                return -1
            }
        } else {
            if ( f < s ) {
                return 1
            } else {
                return -1
            }
        }
    };

    offsetChangeHandler = ( offset ) => {
        this.setState( { offset } )
    };

    onResizeColumns(columns){
        console.log("cols:", columns)
    }

    render() {
        let data = this.state.data;

        return (
            <Table
                data={data}
                columns={this.getColumns()}
                selectedRowIndexes={this.state.selected}
                cellClickHandler={this.cellClickHandler.bind( this )}
                orderBy={this.state.orderBy}
                orderDirection={this.state.orderDirection}
                orderChangeHandler={this.orderChangeHandler.bind( this )}
                offsetChangeHandler={this.offsetChangeHandler}
                offset={this.state.offset}
                limit={this.state.limit}
                limitsList={[ 10, 25, 50, 100 ]}
                limitSelectorHandler={this.changeLimit.bind( this )}
                contextMenuItems={this.getContextMenu.bind( this )}
                contextHeaderMenuItems={this.getContextHeaderMenu.bind( this )}
                onResizeColumns={this.onResizeColumns.bind(this)}
            />
        )
    }


}