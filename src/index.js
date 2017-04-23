import React, { PropTypes } from "react";
import ReactDom from "react-dom";

export class DumbTable extends React.Component {

    constructor( props ) {
        super( props );

        this.isContextMenuOpen = false;
        this.cachedColumnsSize = [];
        this._saveCache();

        this.state = {
            isLimitSelectOpen: false
        }
    }

    componentDidMount() {

        window.addEventListener( "mousedown", this.nextClickHandler.bind( this ) );

        this.cols        = this.table.getElementsByTagName( 'col' ) || [];
        this.headerCells = this.table.getElementsByClassName( 'dumbTable__headerCell' );
        this._setColumnsSize( this.cachedColumnsSize );
    }

    componentWillReceiveProps( props ) {
        if ( this.props.offset !== props.offset ) {
            this.tableBody.scrollTop = 0;
        }
    }

    componentWillUnmount() {
        window.removeEventListener( "mousedown", this.nextClickHandler.bind( this ) )
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
            //console.log("index pieces", pieces);
            let piecePx = summPx / pieces;
            //console.log("index pieces px" , piecePx);
            let newDiff = diff / piecePx;


            let newLeftWidth  = Math.ceil( columns[ index ].width + newDiff );
            let newRightWidth = Math.ceil( columns[ index + 1 ].width - newDiff );

            //console.log("index left", newLeftWidth, newRightWidth, newRightWidth + newLeftWidth);

            if ( newLeftWidth * piecePx < minColWidth || newRightWidth * piecePx < minColWidth ) { // min-width and max-width for each col
                return
            }

            columns[ index ].width += newDiff;
            columns[ index + 1 ].width = pieces - columns[ index ].width;
            let summ                   = columns.reduce( ( sum, col ) => {
                return col.width + sum
            }, 0 );
            //console.log("index sum", summ);
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
            if ( column.width < 5 ) console.error( "Warning: A width in the column can not be less then 5. Change the width parameter in the column with index " + index + "." );
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
                                        <svg pointerEvents="none" viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M7 14l5-5 5 5z"></path>
                                        </svg> :
                                        <svg pointerEvents="none" viewBox="0 0 24 24" width="20" height="20">
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
        let contextMenu      = this.table.getElementsByClassName( 'simple-data-table__context-wrapper' )[ 0 ];
        let list             = contextMenuItems( row, index, key );
        if ( !list || list.length < 1 ) return;
        let renderList = this._renderContextMenuItems( list );
        ReactDom.render( <div>{renderList}</div>, contextMenu );
        contextMenu.style.display = "block";

        let contextMenuHeight = contextMenuItems.length * 30 + 10;

        let windowHeight = window.innerHeight;
        let windowWidth  = window.innerWidth;

        let top  = e.clientY;
        let left = e.clientX;

        let rightDist  = windowWidth - left;
        let bottomDist = windowHeight - top;

        if ( (rightDist - 15) < contextMenuWidth ) {
            left = left - contextMenuWidth - 25 + rightDist;
        }

        if ( (bottomDist - 25) < contextMenuHeight ) {
            top = top - contextMenuHeight - 25 + bottomDist;
        }
        contextMenu.style.top  = top + "px";
        contextMenu.style.left = left + "px";
        // block scroll
        document.onmousewheel  = document.onwheel = function () {
            return false;
        };

        if ( this.isContextMenuOpen ) {
            return
        }

        this.isContextMenuOpen = true;
        // window.addEventListener( "mousedown", this.nextClickHandler.bind( this, contextMenu ) )

    }

    nextClickHandler() {
        let contextMenu = this.table.getElementsByClassName( 'simple-data-table__context-wrapper' )[ 0 ];
        if ( contextMenu.style.display === "block" ) {
            contextMenu.style.display = "none";
            this.isContextMenuOpen    = false;
            // unblock scroll
            document.onmousewheel     = document.onwheel = function () {
                return true;
            };
        }
        if ( this.state.isLimitSelectOpen ) {
            this._onClickAfterSelectOpen()
        }
    }


    _onCellClickHandler( row, index, column, e ) {

        if ( this.props.cellClickHandler ) {
            this.props.cellClickHandler( row, index, column, {
                altKey:   e.altKey,
                ctrlKey:  e.ctrlKey,
                shiftKey: e.shiftKey
            } )
        }
    }

    _get( object, path, def ) {
        return path.replace( /\[/g, '.' ).replace( /\]/g, '' ).split( '.' ).reduce( ( o, k ) => (o || {})[ k ], object ) || def;
    }

    _renderRow( row, index, columns ) {
        return columns.map( ( column, cellIndex ) => {
            // get value by key from object or by Getter from class object

            let value = this._get( row, column.key );
            if ( value === undefined ) {
                if ( typeof row === "object" ) {
                    if ( row.get && typeof row.get === "function" ) {
                        let object = column.key.split( "." );
                        if ( object.length > 1 ) {
                            let str = object.slice( 1 ).join( '.' );
                            value   = this._get( row.get( object[ 0 ] ), str )
                        } else {
                            value = row.get( object[ 0 ] )
                        }
                    }
                } else {
                    value = this.props.defaultCellValue
                }
            }


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
                    onClick={this._onCellClickHandler.bind( this, row, index, column )}
                    onContextMenu={this._contextHandler.bind( this, row, index, column.key )}
                    key={cellIndex}>
                    {value}
                </td>
            )
        } )
    }


    _contextHandler( row, index, key, e ) {
        if ( this.props.contextMenuItems ) {
            this._contextClick( e, row, index, key )
        }
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
        if ( pages <= 1 ) {
            return null;
        }
        // currentPage - 4
        let startPos = 1;
        if ( pages > 5 ) {
            startPos = currentPage > 3 ? ((currentPage > pages - 3) ? pages - 4 : currentPage - 2) : 1;
        }

        let group = [];

        for ( let i = startPos; i <= startPos + 4 && i <= pages; i++ ) {
            let className = "dumbTablePagination__page";
            if ( i === currentPage ) {
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
                        <path
                            d="M6.5 0.2C6.8 0.5 6.8 1 6.5 1.3L1.8 6 6.5 10.7C6.8 11 6.8 11.5 6.5 11.8 6.2 12.1 5.8 12.1 5.5 11.8L0.2 6.5C-0.1 6.2-0.1 5.8 0.2 5.5L5.5 0.2C5.6 0.1 5.8 0 6 0 6.2 0 6.4 0.1 6.5 0.2Z"
                            fillRule="evenodd"/>
                    </svg>
                </button>
                <ul className="dumbTablePagination__pages">
                    {group}
                </ul>
                <button onClick={this._offsetChangeHandler.bind( this, "forward", currentPage, limit )}
                        className="dumbTablePagination__btn"
                        disabled={currentPage === pages}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                        <path
                            d="M0.2 11.8C-0.1 11.5-0.1 11 0.2 10.7L4.9 6 0.2 1.3C-0.1 1-0.1 0.5 0.2 0.2 0.5-0.1 1-0.1 1.3 0.2L6.5 5.5C6.8 5.8 6.8 6.2 6.5 6.5L1.3 11.8C1.1 11.9 0.9 12 0.7 12 0.6 12 0.4 11.9 0.2 11.8Z"
                            fillRule="evenodd"/>
                    </svg>
                </button>
            </div>
        )
    }

    _renderReloadButton() {
        return (
            <button className="dumbTable__btn reload-btn" onClick={this.props.reloadButtonHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12"
                     className="dumbTable__icon">
                    <path
                        d="M13.2 1.2L13.2 4.8C13.2 5.1 12.9 5.4 12.6 5.4L9 5.4C8.7 5.4 8.4 5.1 8.4 4.8 8.4 4.5 8.7 4.2 9 4.2L11 4.2C10.2 3.4 9.6 2.8 9.4 2.6 8.9 2.1 8.4 1.8 7.8 1.6 7.2 1.3 6.6 1.2 6 1.2 5.4 1.2 4.8 1.3 4.2 1.6 3.6 1.8 3.1 2.1 2.6 2.6 2.1 3.1 1.8 3.6 1.6 4.2 1.3 4.8 1.2 5.4 1.2 6 1.2 6.6 1.3 7.2 1.6 7.8 1.8 8.4 2.1 8.9 2.6 9.4 3.1 9.9 3.6 10.2 4.2 10.4 4.8 10.7 5.4 10.8 6 10.8 6.6 10.8 7.2 10.7 7.8 10.4 8.4 10.2 8.9 9.9 9.4 9.4 9.7 9.1 9.9 8.9 10.1 8.5 10.3 8.2 10.4 7.9 10.5 7.6 10.6 7.3 11 7.1 11.3 7.2 11.6 7.3 11.8 7.7 11.7 8 11.5 8.4 11.3 8.8 11.1 9.2 10.8 9.6 10.6 9.9 10.2 10.2 9.7 10.8 9 11.3 8.3 11.6 7.9 11.7 7.5 11.8 7.1 11.9 6.8 12 6.4 12 6 12 5.6 12 5.2 12 4.9 11.9 4.5 11.8 4.1 11.7 3.7 11.6 3 11.3 2.3 10.8 1.8 10.2 1.2 9.7 0.7 9 0.4 8.3 0.3 7.9 0.2 7.5 0.1 7.1 0 6.8 0 6.4 0 6 0 5.6 0 5.2 0.1 4.9 0.2 4.5 0.3 4.1 0.4 3.7 0.7 3 1.2 2.3 1.8 1.8 2.3 1.2 3 0.7 3.7 0.4 4.1 0.3 4.5 0.2 4.9 0.1 5.2 0 5.6 0 6 0 6.4 0 6.8 0 7.1 0.1 7.5 0.2 7.9 0.3 8.3 0.4 9 0.7 9.7 1.2 10.2 1.8 10.4 1.9 11.1 2.6 12 3.5L12 1.2C12 0.9 12.3 0.6 12.6 0.6 12.9 0.6 13.2 0.9 13.2 1.2Z"
                        fillRule="nonzero"/>
                </svg>
            </button>
        )
    }

    _onLimitChangeHandler( item ) {
        this.setState( { isLimitSelectOpen: false } );
        this.props.limitSelectorHandler && this.props.limitSelectorHandler( item )
    }


    _openSelect() {
        this.setState( { isLimitSelectOpen: true } );
    }

    _onClickAfterSelectOpen() {
        this.setState( { isLimitSelectOpen: false } )
    }


    _renderSelectItems( items ) {
        if ( !items || items && items.length < 1 ) return null;
        return items.map( ( item, index ) => {
            return <div onMouseDown={this._onLimitChangeHandler.bind( this, item )}
                        className="dumbTableSelect__listItem" key={index}>
                {item}
            </div>
        } )
    }

    _renderLimitSelector( limit, limitsList ) {
        return (
            <div className="dumbTableSelect" id="dumbTableSelect" onClick={this._openSelect.bind( this )}
                 ref={( limitSelect ) => this.limitSelect = limitSelect}>
                {
                    this.state.isLimitSelectOpen && <div className="dumbTableSelect__list">
                        {this._renderSelectItems( limitsList )}
                    </div>

                }
                <div>{limit}</div>
                <svg pointerEvents="none" className="dumbTableSelect__icon" xmlns="http://www.w3.org/2000/svg"
                     width="10" height="5" viewBox="0 0 10 5">
                    <polygon fillRule="nonzero" points="0 0 5 5 10 0"/>
                </svg>
            </div>
        )
    }

    _renderFooterButtons( buttons ) {
        if ( !buttons || buttons && buttons.length === 0 ) return null;

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


        return (
            <div ref={( ref ) => this.table = ref } className="dumbTable">
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
                { showFooter &&
                <div className="simple-data-table__footer" style={{ height: footerHeight }}>
                    <div className="simple-data-table__footer-info">
                        <div className="dumbTableInfo"><span>{first_num}</span> - <span>{last_num}</span> of
                            <span> {total}</span></div>
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
    contextMenuItems: PropTypes.func,
    defaultCellValue: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.element ] )
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
    total:                0,
    limitsList:           [ 10, 25, 50 ],
    footerButtons:        [],

    headerHeight: 40,

    orderBy:            "id",
    orderDirection:     "ASC",
    orderChangeHandler: null,
    rightClickHandler:  null,
    contextMenuWidth:   150,
    contextMenuItems:   null,
    defaultCellValue:   undefined
};