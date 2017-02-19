import React, { PropTypes } from "react";
import ReactDom from "react-dom";

export class DumbTable extends React.Component {

    constructor( props ) {
        super( props );

        this.isContextMenuOpen = false;
        this.cachedColumnsSize = [];
        this._saveCache();

        this.state = {
            isContextMenuOpen: false
        }
    }

    componentDidMount() {
        const { table } = this.refs;

        this.table       = table;
        this.cols        = table.getElementsByTagName( 'col' ) || [];
        this.headerCells = table.getElementsByClassName( 'dumbTable__headerCell' );
        this._setColumnsSize( this.cachedColumnsSize );
    }

    _saveCache( columns = this.props.columns ) {
        columns.map( ( col ) => {
            this.cachedColumnsSize.push( { width: col.width } );
        } );
    }

    handleMouseDown( e ) {
        e.preventDefault();
        document.body.className += " no-selection";

        let minColWidth = this.props.minColWidth;

        let columns        = this.cachedColumnsSize;
        let div            = e.target.parentNode;
        let index          = Number( div.getAttribute( 'data-index' ) );
        let originalOffset = e.clientX;
        let originalWidth  = div.offsetWidth;

        let summPx = this.headerCells[ index ].offsetWidth + this.headerCells[ index + 1 ].offsetWidth;

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

            let summ = this.cachedColumnsSize.reduce( ( sum, col ) => {
                //console.log("index col", col.width);
                return sum += col.width
            }, 0 );
            //console.log("index all", summ);


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
        columns.reduce( ( secondIndex, column, index ) => {
            this.cols[ index ].style.width       = column.width + '%';
            this.cols[ secondIndex ].style.width = column.width + '%';

            return secondIndex + 1;
        }, this.cols.length / 2 );
    }

    _renderColumnsSync( columns ) {
        return (
            <colgroup>
                {columns.map( ( ol, index ) => {
                    return <col data-index={index} key={index}/>
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
        return (
            <thead>
            <tr>
                {columns.map( ( col, index ) => {

                    return (
                        <th style={{ height: headerHeight }} data-index={index} key={index}>
                            <div
                                onClick={this._orderChangeHandler.bind( this, orderBy, col.sortKey || col.key, orderDirection )}
                                className="dumbTable__headerCell">
                                {col.name}
                            </div>
                            {(orderBy === col.sortKey || orderBy === col.key) &&
                                <div className="dumbTable__headerSort">
                                    {
                                        (orderDirection === "ASC") ?
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M7 14l5-5 5 5z"></path>
                                            </svg> :
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M7 10l5 5 5-5z"></path>
                                            </svg>
                                    }
                                </div>
                            }
                            { index != columns.length - 1 &&
                                <div onMouseDown={this.handleMouseDown.bind( this )}
                                     className="dumbTable__headerCellResize"/>
                            }
                        </th>
                    )
                } )}
            </tr>
            </thead>
        )
    }

    _contextClick( e, row, index, key ) {
        if ( this.props.rightClickHandler ) {
            this.props.rightClickHandler( e, row, index, key );
            return
        }
        e.preventDefault();

        let contextMenuWidth = this.props.contextMenuWidth;
        let contextMenuItems = this.props.contextMenuItems;


        //console.log("index _contextClick", row, index, key);
        let contextMenu = this.table.getElementsByClassName( 'simple-data-table__context-wrapper' )[ 0 ];

        let list = contextMenuItems( row, index, key );

        if ( !list || list.length < 1 ) return

        console.log( "index _contextClick", list );

        let renderList = this._renderContextMenuItems( list );

        ReactDom.render( <div>{renderList}</div>, contextMenu );


        contextMenu.style.display = "block";

        //console.log("index _contextClick", e.clientX, e.clientY);


        let contextMenuHeight = contextMenuItems.length * 30 + 10;

        let windowHeight = window.innerHeight;
        let windowWidth  = window.innerWidth;

        //console.log("index _contextClick windowHeight", windowHeight);

        let top  = e.clientY;
        let left = e.clientX;

        console.log( "index _contextClick", top, left );
        let rightDist  = windowWidth - left;
        let bottomDist = windowHeight - top;

        //console.log("index _contextClick bottomDist", bottomDist);

        if ( (rightDist - 15) < contextMenuWidth ) {
            left = left - contextMenuWidth - 25 + rightDist;
        }

        if ( (bottomDist - 25) < contextMenuHeight ) {
            top = top - contextMenuHeight - 25 + bottomDist;
        }
        contextMenu.style.top  = top + "px";
        contextMenu.style.left = left + "px";
        //contextMenu.style.height = contextMenuHeight + "px";

        this.tableBody.style.overflowY = "hidden";

        if ( this.isContextMenuOpen ) {
            return
        }

        this.isContextMenuOpen = true;
        document.addEventListener( "mousedown", this.nextClickHandler.bind( this, contextMenu ) )

    }

    nextClickHandler( contextMenu ) {
        contextMenu.style.display = "none";
        this.isContextMenuOpen    = false;
        if ( this.tableBody && this.tableBody.style ) this.tableBody.style.overflowY = "auto";
        document.removeEventListener( "mousedown", this.nextClickHandler )
    }


    _onCellClickHandler( e, row, index, column ) {

        if ( this.props.cellClickHandler ) {
            this.props.cellClickHandler( row, index, column, {
                altKey:   e.altKey,
                ctrlKey:  e.ctrlKey,
                shiftKey: e.shiftKey
            } )
        }
    }

    _renderRow( row, index, columns ) {
        return columns.map( ( column, cellIndex ) => {
            // get value by key from object or by Getter from class object
            let value = row[ column.key ] || row.get( column.key );

            if ( column.render ) {
                value = column.render( row, index, column )
            } else {
                // parse type email
                if ( column.type === "email" ) {
                    value = <a href={"mailto:" + value}>{value}</a>
                }
                // parse type link
                if ( column.type === "link" ) {
                    value = <a target={column.target || "_self"}
                               href={row[ column.link ] || row.get( column.link )}>{value}</a>
                }
            }


            return (
                <td className="dumbTable__contentCell"
                    onClick={( e ) => this._onCellClickHandler( e, row, index, column )}
                    onContextMenu={( e ) => this._contextClick( e, row, index, column.key )}
                    key={cellIndex}>
                    {value}
                </td>
            )
        } )
    }


    _renderBody( data, columns, rowHeight, selectedRowIndexes ) {
        return (
            <tbody>
            {data.map( ( row, index ) => {
                let className = 'dumbTable__contentRow ';

                if ( selectedRowIndexes.some( selRow => selRow === index ) ) {
                    className += 'dumbTable__contentRow--selected';
                }

                return (
                    <tr style={{ height: rowHeight }}
                        className={className}
                        key={index}>
                        {this._renderRow( row, index, columns )}
                    </tr>
                )
            } )}
            </tbody>
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
        if(pages <= 1){
            return null;
        }

        const startPos = currentPage > 3 ? ((currentPage > pages - 3) ? pages - 4 : currentPage - 2) : 1;
        let group = [];

        for ( let i = startPos; i <= startPos + 4 && i <= pages; i++ ) {
            let className = "dumbTablePagination__page";

            if (i === currentPage){
                className += ` ${className}--active`;
            }

            group.push(
                <li onClick={this._offsetChangeHandler.bind( this, i, currentPage, limit )}
                    className={className}
                    id={i}
                    key={i}>
                    {i}
                </li>
            );
        }


        return (
            <div className="dumbTablePagination">
                <button onClick={this._offsetChangeHandler.bind( this, "back", currentPage, limit )}
                        className="dumbTablePagination__btn"
                        disabled={currentPage === startPos}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                        <path d="M6.5 0.2C6.8 0.5 6.8 1 6.5 1.3L1.8 6 6.5 10.7C6.8 11 6.8 11.5 6.5 11.8 6.2 12.1 5.8 12.1 5.5 11.8L0.2 6.5C-0.1 6.2-0.1 5.8 0.2 5.5L5.5 0.2C5.6 0.1 5.8 0 6 0 6.2 0 6.4 0.1 6.5 0.2Z" fillRule="evenodd"/>
                    </svg>
                </button>
                <ul className="dumbTablePagination__pages">
                    {group}
                </ul>
                <button onClick={this._offsetChangeHandler.bind( this, "forward", currentPage, limit )}
                        className="dumbTablePagination__btn"
                        disabled={currentPage === pages}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                        <path d="M0.2 11.8C-0.1 11.5-0.1 11 0.2 10.7L4.9 6 0.2 1.3C-0.1 1-0.1 0.5 0.2 0.2 0.5-0.1 1-0.1 1.3 0.2L6.5 5.5C6.8 5.8 6.8 6.2 6.5 6.5L1.3 11.8C1.1 11.9 0.9 12 0.7 12 0.6 12 0.4 11.9 0.2 11.8Z" fillRule="evenodd"/>
                    </svg>
                </button>
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
                    onChange={( e ) => this.props.limitSelectorHandler && this.props.limitSelectorHandler( Number( e.target.value ) )}>
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
        if (!buttons || buttons && buttons.length === 0) return null;

        return buttons.map( ( button, i ) => {
            return <button onClick={button.onClickHandler} key={i}
                           className={"simple-data-table__button " + ((button.className) ? button.className : "")}>
                {button.title}
            </button>
        } )

    }

    _renderContextMenuItems( items ) {
        if ( !items || items && items.length < 1 ) return null
        return items.map( ( item, index ) => {
            if ( item.type === "divider" ) {
                return <div className="simple-data-table__context-menu__item__divider" key={index}></div>
            }

            return <div onMouseDown={item.onClickHandler}
                        className="simple-data-table__context-menu__item" key={index}>
                {item.title}
            </div>
        } )
    }

    render() {
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

        let headerHeight       = this.props.headerHeight;
        let selectedRowIndexes = this.props.selectedRowIndexes;

        let orderBy        = this.props.orderBy;
        let orderDirection = this.props.orderDirection;
        let footerButtons  = this.props.footerButtons;


        let pages       = Math.ceil( total / limit );
        let currentPage = (offset / limit) + 1;

        let first_num = offset + 1;
        let last_num  = (currentPage < pages) ? currentPage * limit : total;

        let contextMenuItems = this.props.contextMenuItems;

        return (
            <div ref="table" className="dumbTable">
                <div className="dumbTable__header">
                    <table>
                        {this._renderColumnsSync( cachedColumns )}
                        {this._renderHeader( columns, headerHeight, orderBy, orderDirection )}
                    </table>
                </div>
                <div ref={( ref ) => this.tableBody = ref} className="dumbTable__content">
                    <table >
                        {this._renderColumnsSync( cachedColumns )}
                        {this._renderBody( data, columns, rowHeight, selectedRowIndexes )}
                    </table>
                </div>
                {
                    showFooter ?
                        <div className="simple-data-table__footer" style={{ height: footerHeight }}>
                            <div className="simple-data-table__footer-info">
                                <div>{first_num} - {last_num} of {total} </div>
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
                <div className={"simple-data-table__context-wrapper"}>

                </div>

            </div>
        )

    }

}


DumbTable.propTypes = {
    columns:     PropTypes.array.isRequired,
    data:        PropTypes.any.isRequired,
    rowHeight:   PropTypes.number,
    minColWidth: PropTypes.number,

    cellClickHandler:   PropTypes.func,
    selectedRowIndexes: PropTypes.any,

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
    orderChangeHandler: PropTypes.func,

    rightClickHandler: PropTypes.func,

    contextMenuWidth: PropTypes.number,
    contextMenuItems: PropTypes.func
};

DumbTable.defaultProps = {
    columns:            [],
    data:               [],
    rowHeight:          30,
    bottomRow:          false,
    minColWidth:        60,
    cellClickHandler:   null,
    selectedRowIndexes: [],

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
    orderChangeHandler: null,
    rightClickHandler:  null,
    contextMenuWidth:   150,
    contextMenuItems:   ( row, index, key ) => {
        return [
            { title: "Edit row", onClickHandler: () => console.log( "index action menu click" ) },
            { title: "Delete row", onClickHandler: () => console.log( "index action menu click" ) },
            { type: "divider" },
            { title: "Create new", onClickHandler: () => console.log( "index action menu click" ) },
        ];
    }


};