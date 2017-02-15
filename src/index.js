import React, { PropTypes } from "react";

/**
 *
 * TODO resize problem
 *
 *
 *
 *
 */

export class SimpleTable extends React.Component {

    guid() {
        function s4() {
            return Math.floor( (1 + Math.random()) * 0x10000 )
            .toString( 16 )
            .substring( 1 );
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    constructor( props ) {
        super( props );
        window.table           = this;
        this.cachedColumnsSize = [];
        this._saveCache( props.columns );
        this.uuid = this.guid();
    }

    _saveCache( columns ) {
        columns.map( ( col, i ) => {
            this.cachedColumnsSize.push( { width: col.width } )
        } )
    }

    handleMouseDown( e ) {
        e.preventDefault();
        document.body.className += " no-selection";

        let minColWidth = this.props.minColWidth;

        //let columns        = this.props.columns;
        let columns        = this.cachedColumnsSize;
        let div            = e.target.parentNode;
        let index          = Number( div.getAttribute( "data-index" ) );
        let originalOffset = e.clientX;
        let originalWidth  = div.offsetWidth;

        let arrayDivs = document.getElementsByClassName( "simple-data-table__header-cell-resizer-container" );

        let summPx = arrayDivs[ index ].offsetWidth + arrayDivs[ index + 1 ].offsetWidth;

        document.onmousemove = function ( e ) {
            let newOffset = e.clientX;

            let diff = newOffset - originalOffset;

            let newSize = originalWidth + diff;

            let pieces  = (columns[ index ].width + columns[ index + 1 ].width);
            let piecePx = summPx / pieces;

            let newDiff = diff / piecePx;

            let newLeftWidth  = columns[ index ].width + newDiff;
            let newRightWidth = columns[ index + 1 ].width - newDiff;

            if ( newLeftWidth * piecePx < minColWidth || newRightWidth * piecePx < minColWidth ) { // min-width and max-width for each col
                return
            }

            columns[ index ].width += newDiff;
            columns[ index + 1 ].width -= newDiff;


            this._setColumnsSize( this.cachedColumnsSize );
            originalWidth  = newSize;
            originalOffset = newOffset;

        }.bind( this );
        document.onmouseup   = function () {
            document.body.className = document.body.className.replace( /(?:^|\s)no-selection(?!\S)/g, '' );
            document.onmousemove    = document.onmouseup = null;
        }.bind( this );
    }

    _setColumnsSize( columns ) {

        //style={col.width && { width: col.width + "%" || "auto" }}
        let colgroupHeader = document.getElementsByClassName( "data-table_colgroup-header" + "-" + this.uuid ) || [];
        let colgroupBody   = document.getElementsByClassName( "data-table_colgroup-body" + "-" + this.uuid ) || [];

        //console.log("index _setColumnsSize", colgroupHeader);
        //console.log("index _setColumnsSize", colgroupBody);


        columns.forEach( ( column, index ) => {
            colgroupHeader[ index ].style.width = column.width + "%";
            colgroupBody[ index ].style.width   = column.width + "%";

        } )

    }

    _renderColumnsSync( columns, place, uuid ) {
        return (
            <colgroup>
                {columns.map( ( col, index ) => {
                    return <col className={"data-table_colgroup-" + place + "-" + uuid} data-index={index} key={index}/>
                } )}
            </colgroup>
        )
    }


    _orderChangeHandler( orderBy, key, orderDirection ) {
        let dir = orderDirection;
        if ( orderBy === key ) {
            dir = (orderDirection === "ASC") ? "DESC" : "ASC"
        }

        this.props.orderChangeHandler && this.props.orderChangeHandler( key, dir );
    }

    _renderHeader( columns, headerHeight, orderBy, orderDirection ) {
        //console.log( "index _renderHeader", orderBy );
        return (
            <thead>
            <tr>
                {columns.map( ( col, index ) => {

                    return (
                        <th style={{ height: headerHeight }} className="simple-data-table__header-cell" key={index}
                        >
                            <div className="simple-data-table__header-cell-content"

                            >{col.name}</div>
                            <div className="simple-data-table__header-cell-resizer-container" data-index={index}>
                                <div
                                    style={{ height: headerHeight }}
                                    onMouseDown={this.handleMouseDown.bind( this )}

                                    className="simple-data-table__header-cell-resizer-container-resizer"/>
                            </div>
                            {(orderBy === col.sortKey || orderBy === col.key) ?
                                <div className="simple-data-table__header-cell-order-container">
                                    {
                                        (orderDirection === "ASC") ?
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M7 14l5-5 5 5z"></path>
                                            </svg> :
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M7 10l5 5 5-5z"></path>
                                            </svg>
                                    }

                                </div> :
                                null
                            }
                            <div className="simple-data-table__header-listener"
                                 onClick={this._orderChangeHandler.bind( this, orderBy, col.sortKey || col.key, orderDirection )}></div>

                        </th>
                    )
                } )}
            </tr>
            </thead>
        )
    }


    _renderRow( row, columns ) {
        return columns.map( ( column, cellIndex ) => {

            //let value = row[ column.key ] || row.get(column.key);
            let value = row[ column.key ] || row.get( column.key )

            return (
                <td className="simple-data-table__content-cell" key={cellIndex}>
                    {value}
                </td>
            )
        } )
    }

    _rowSelectHandler( row, index ) {
        this.props.rowSelectHandler && this.props.rowSelectHandler( row, index )

    }

    _renderBody( data, columns, rowHeight, selectedRowIndex ) {
        return (
            <tbody>
            {data.map( ( row, index ) => {
                let className = "data-table__content-row";
                if ( selectedRowIndex ) className += "data-table__content-row-selected";
                return (
                    <tr style={{ height: rowHeight }}
                        className={className}
                        key={index}
                        onClick={() => {this._rowSelectHandler( row, index )}}>
                        {this._renderRow( row, columns )}
                    </tr>
                )
            } )}
            </tbody>
        )

    }

    _renderBottomRow( columns ) {
        return (
            <tfoot>
            <tr>
                {
                    columns.map( ( col, index ) => {
                        return (
                            <td key={index}>
                                50
                            </td>
                        )
                    } )
                }
            </tr>
            </tfoot>
        )
    }


    _offsetChangeHandler( key, currentPage, limit ) {


        if ( currentPage === key ) return;

        console.log( key );
        if ( key === "back" ) {
            key = ( currentPage - 2) * limit;
        } else if ( key === "forward" ) {
            key = currentPage * limit;
        } else {
            key = (key - 1) * limit;
        }
        this.props.offsetChangeHandler && this.props.offsetChangeHandler( key )
    }

    _renderPagination( offset, limit, total, pages, currentPage ) {

        if ( pages <= 1 ) {
            return null
        }

        let pagesRender = [];
        let startPos    = currentPage > 3 ? ( (currentPage > pages - 3) ? pages - 4 : currentPage - 2) : 1;

        let group = [];

        for ( let i = startPos; i <= startPos + 4 && i <= pages; i++ ) {
            let className = "simple-data-table__button";
            if ( i === currentPage ) className += " active";
            group.push( <button onClick={this._offsetChangeHandler.bind( this, i, currentPage, limit )}
                                className={className} id={String( i )} key={i}>{String( i )}</button> )
        }


        pagesRender.push( <div className="simple-data-table__buttons_group" key="btn-group">
            {group}
        </div> );

        pagesRender.unshift( <button onClick={this._offsetChangeHandler.bind( this, "back", currentPage, limit )}
                                     className="simple-data-table__button simple-data-table__button-icon"
                                     disabled={currentPage === startPos}
                                     id={currentPage - 1} key="back">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z">
                </path>
            </svg>
        </button> );
        pagesRender.push( <button onClick={this._offsetChangeHandler.bind( this, "forward", currentPage, limit )}
                                  className="simple-data-table__button simple-data-table__button-icon"
                                  disabled={currentPage === pages} id={currentPage + 1}
                                  key="forward">
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z">
                </path>
            </svg>
        </button> );

        return (
            <div className="simple-data-table__footer-pagination-buttons">
                {pagesRender}
            </div>
        )
    }

    _renderReloadButton() {
        return (
            <button className="simple-data-table__footer-reload-button" onClick={this.props.reloadButtonHandler}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                        d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z">
                    </path>
                </svg>
            </button>
        )
    }

    _renderLimitSelector( limit, limitsList ) {
        return (
            <div className="simple-data-table__footer-limit-selector-wrapper">
                <select
                    className="simple-data-table__footer-select"
                    onChange={( e ) => this.props.limitSelectorHandler && this.props.limitSelectorHandler( e.target.value )}>
                    {limitsList.map( limit => {
                        return <option key={limit} value={limit}>{limit}</option>
                    } )}
                </select>
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M7 10l5 5 5-5z"></path>
                </svg>
            </div>
        )
    }

    _renderFooterButtons( buttons ) {
        if ( buttons.length === 0 ) return null;

        return buttons.map( ( button, i ) => {
            return <button onClick={button.onClickHandler} key={i}
                           className={"simple-data-table__button " + ((button.className) ? button.className : "")}>
                {button.title}
            </button>
        } )

    }

    render() {
        console.log( "index render" );
        let columns       = this.props.columns;
        let cachedColumns = this.cachedColumnsSize;
        let data          = this.props.data;
        let rowHeight     = this.props.rowHeight;
        let showFooter    = this.props.showFooter;
        let footerHeight  = this.props.footerHeight;


        let total      = this.props.total;
        let limit      = this.props.limit;
        let offset     = this.props.offset;
        let limitsList = this.props.limitsList;

        let headerHeight     = this.props.headerHeight;
        let selectedRowIndex = this.props.selectedRowIndex;

        let orderBy        = this.props.orderBy;
        let orderDirection = this.props.orderDirection;
        let footerButtons  = this.props.footerButtons;


        let pages       = Math.ceil( total / limit );
        let currentPage = (offset / limit) + 1;

        let first_num = offset + 1;
        let last_num  = (currentPage < pages) ? currentPage * limit : total;

        return (
            <div id="table" ref={( ref ) => this.tableWrapper = ref} className="simple-data-table">
                <div
                    ref={( ref ) => this.header = ref}

                    className="simple-data-table__header">
                    <table ref={( ref ) => this.table = ref}>
                        {this._renderColumnsSync( cachedColumns, "header", this.uuid )}
                        {this._renderHeader( columns, headerHeight, orderBy, orderDirection )}
                    </table>
                </div>
                <div className="simple-data-table__content">
                    <table ref={( ref ) => this.tableBody = ref}>
                        {this._renderColumnsSync( cachedColumns, "body", this.uuid )}
                        {this._renderBody( data, columns, rowHeight, selectedRowIndex )}
                    </table>
                </div>
                {
                    showFooter ?
                        <div className="simple-data-table__footer" style={{ height: footerHeight }}>
                            <div className="simple-data-table__footer-info">
                                <div>{first_num} - {last_num} из {total} записей</div>
                            </div>
                            <div className="simple-data-table__footer-pagination">
                                {this._renderPagination( offset, limit, total, pages, currentPage )}
                            </div>
                            <div className="simple-data-table__footer-settings">
                                {this._renderFooterButtons( footerButtons )}
                                {this._renderReloadButton()}
                                {this._renderLimitSelector( limit, limitsList )}
                            </div>
                        </div>
                        :
                        null
                }

            </div>
        )

    }

}

SimpleTable.propTypes = {
    columns:     PropTypes.array.isRequired,
    data:        PropTypes.any.isRequired,
    rowHeight:   PropTypes.number,
    minColWidth: PropTypes.number,

    rowSelectHandler: PropTypes.func,
    selectedRowIndex: PropTypes.number,

    showFooter:           PropTypes.bool,
    footerHeight:         PropTypes.any,
    limit:                PropTypes.number,
    offset:               PropTypes.number,
    total:                PropTypes.number,
    reloadButtonHandler:  PropTypes.func,
    limitSelectorHandler: PropTypes.func,
    offsetChangeHandler:  PropTypes.func,
    limitsList:           PropTypes.arrayOf( PropTypes.number ),
    footerButtons:        PropTypes.array,

    headerHeight: PropTypes.number,

    orderBy:            PropTypes.string,
    orderDirection:     PropTypes.oneOf( [ "ASC", "DESC" ] ),
    orderChangeHandler: PropTypes.func
};

SimpleTable.defaultProps = {
    columns:          [],
    data:             [],
    rowHeight:        30,
    bottomRow:        false,
    minColWidth:      60,
    rowSelectHandler: null,
    selectedRowIndex: null,

    showFooter:           true,
    footerHeight:         40 + 'px',
    reloadButtonHandler:  null,
    limitSelectorHandler: null,
    offsetChangeHandler:  null,
    limit:                10,
    offset:               0,
    total:                100,
    limitsList:           [ 10, 25, 50 ],
    footerButtons:        [],

    headerHeight: 40,

    orderBy:            "id",
    orderDirection:     "ASC",
    orderChangeHandler: null
};