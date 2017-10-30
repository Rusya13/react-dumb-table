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

stories.add( 'Top movies IMDB', withReadme( TableReadme, () => {
    return (
        <TableController/>
    )
} ) );


let Table = LoaderHOC( "data" )( DumbTable );


class Model {

    constructor( row ) {
        this.attributes = {};
        this.set( row )
    }

    get( key ) {
        return this.attributes[ key ]
    }

    set( o, v ) {
        if ( typeof o === 'string' && v ) {
            this.attributes[ o ] = v
        } else {
            let keys = Object.keys( o );
            keys.forEach( key => {
                this.attributes[ key ] = o[ key ]
            } )
        }
    }

    get name() {
        return this.get( "name" )
    }

}


class TableController extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            limit:          20,
            page:           1,
            fontSize:       14,
            selected:       [],
            orderBy:        "title",
            orderDirection: "ASC",
            data:           [],
            api_key: "5f87f7d4c3a7c0aaa3b6653b919968af"
        };

    }

    componentDidMount() {
        this.fetch()
    }

    fetch = ( page = 1 ) => {
        fetch( "https://api.themoviedb.org/3/movie/top_rated?api_key="+this.state.api_key+ "&page=" + page ).then( res => res.json() )
        .then( json => {
            this.setState( {
                data:  json.results.map( item => {
                    return new Model( item )
                } ),
                page:  json.page,
                total: json.total_results
            } )
        } ).catch( e => {
            console.log( "Error api", e );
        } )
    };

    getColumns() {
        return [
            { name: "Title", key: "title", width: 20 },
            { name: "Original title", key: "original_title", width: 20 },
            { name: "Vote", key: "vote_average", width: 20, type:"number", number:true },
            { name: "Release date", key: "release_date", width: 20 },
        ]
    }

    getContextMenu( row, index, key ) {
        this.setState( { selected: [ index ] } );

        return (
            [
                {
                    title: "Edit row", onClickHandler: action( ('Edit row action') )
                },
                { title: "Delete row", onClickHandler: action( ('Delete row') ) },
                { type: "divider" },
                { title: "Create new", onClickHandler: action( 'Create new row' ) },
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

    offsetChangeHandler = ( offset ) => {
        console.log( 'index offsetChangeHandler', offset );
        let page = offset / this.state.limit + 1
        console.log( 'index offsetChangeHandler', page )
        this.fetch( page )
    };

    onResizeColumns( columns ) {
        console.log( "cols:", columns )
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
                offset={(this.state.page - 1) * this.state.limit}
                total={this.state.total}
                limit={this.state.limit}
                limitsList={[ 20 ]}
                fontSize={this.state.fontSize}
                limitSelectorHandler={this.changeLimit.bind( this )}
                contextMenuItems={this.getContextMenu.bind( this )}
                contextHeaderMenuItems={this.getContextHeaderMenu.bind( this )}
                onResizeColumns={this.onResizeColumns.bind( this )}
            />
        )
    }


}