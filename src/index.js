import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { fakeData } from "./fakeData";

class SimpleDataTable extends React.Component {

    constructor( props ) {
        super( props );
        window.table = this;

    }

    componentDidMount() {
        window.addEventListener( "resize", this.resizeTable.bind( this ) )
        this._setColumnsSize(this.props.columns)
    }

    componentWillUnmount() {
        window.removeEventListener( "resize", this.resizeTable.bind( this ) )
    }

    resizeTable() {
        this.table.style.width     = this.tableWrapper.getBoundingClientRect().width + "px";
        this.tableBody.style.width = this.tableWrapper.getBoundingClientRect().width + "px";
    }

    handleMouseDown2( e ) {
        document.body.className += " no-selection";


        let columns        = this.props.columns;
        let div            = e.target.parentNode;
        let index          = Number( div.getAttribute( "data-index" ) );
        let originalOffset = e.clientX;
        let originalWidth  = div.offsetWidth;

        let arrayDivs = document.getElementsByClassName( "flex-wrap-div" );

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

            if ( newLeftWidth * piecePx < 20 || newRightWidth * piecePx < 20 ) {
                return
            }

            columns[ index ].width += newDiff;
            columns[ index + 1 ].width -= newDiff;
            this._setColumnsSize(this.props.columns);
            originalWidth  = newSize;
            originalOffset = newOffset;

        }.bind( this );
        document.onmouseup   = function () {
            document.body.className = document.body.className.replace( /(?:^|\s)no-selection(?!\S)/g, '' );
            document.onmousemove    = document.onmouseup = null;
        }.bind( this );
    }

    _setColumnsSize(columns){

        //style={col.width && { width: col.width + "%" || "auto" }}
        let colgroupHeader = document.getElementsByClassName("data-table_colgroup-header") || [];
        let colgroupBody = document.getElementsByClassName("data-table_colgroup-body") || [];
        let colgroupBottomRow = document.getElementsByClassName("data-table_colgroup-bottom-row") || [];
        //console.log("index _setColumnsSize", colgroupHeader);
        //console.log("index _setColumnsSize", colgroupBody);
        //console.log("index _setColumnsSize", colgroupBottomRow);

        columns.forEach((column, index)=>{
            colgroupHeader[index].style.width = column.width + "%";
            colgroupBody[index].style.width = column.width + "%";
            //colgroupBottomRow[index].style.width = column.width + "%";
        })

    }

    _renderColumnsSync( columns, place ) {
        return (
            <colgroup>
                {columns.map( ( col, index ) => {
                    return <col className={"data-table_colgroup-"+place} data-index={index} key={index} />
                })}
            </colgroup>
        )
    }

    _renderHeader( columns ) {
        return (
            <thead>
            <tr>
                {columns.map( ( col, index ) => {
                    return (
                        <th className="flex-wrap" key={index}>
                            <div className="box">{col.title}</div>
                            <div className="flex-wrap-div" data-index={index}>
                                <div
                                    onMouseDown={this.handleMouseDown2.bind( this )}
                                    style={{ cursor: "col-resize" }}
                                    className="resize-handle-new"/>
                            </div>
                        </th>
                    )
                } )}
            </tr>
            </thead>
        )
    }


    _renderRow( row, columns ){
        return columns.map((column, cellIndex)=>{

            let value = row[column.key];
            //console.log("index value", value);
            return (
                <td key={cellIndex}>
                    {value}
                </td>
            )
        })
    }

    _renderBody( data, columns ) {
        return (
            <tbody>
            {data.map( ( row, index ) => {

                return (
                    <tr key={index}>
                        {this._renderRow(row, columns)}
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

    render() {
        let columns   = this.props.columns;
        let data      = this.props.data;
        let bottomRow = this.props.bottomRow;

        return (
            <div id="table" ref={( ref ) => this.tableWrapper = ref} className="data-table">
                <div
                    ref={( ref ) => this.header = ref}
                    className="data-table__header">
                    <table ref={( ref ) => this.table = ref}>
                        {this._renderColumnsSync( columns, "header" )}
                        {this._renderHeader( columns )}
                    </table>
                </div>
                <div className="data-table__content">
                    <table ref={( ref ) => this.tableBody = ref}>
                        {this._renderColumnsSync( columns , "body")}
                        {this._renderBody( data, columns )}
                    </table>
                </div>
                {
                    bottomRow ?
                        <div className="data-table_bottom_row">
                            <table ref={( ref ) => this.tableBottomRow = ref}>
                                {this._renderColumnsSync( columns , "bottom-row")}
                                {this._renderBottomRow( columns )}
                            </table>
                        </div>
                        :
                        null
                }

            </div>
        )

    }

}

SimpleDataTable.propTypes = {
    height:    PropTypes.number.isRequired,
    columns:   PropTypes.array.isRequired,
    data:      PropTypes.array.isRequired,
    bottomRow: PropTypes.bool
};

SimpleDataTable.defaultProps = {
    height:    500,
    columns:   [],
    data:      [],
    bottomRow: false
};


ReactDOM.render( <SimpleDataTable
    data={fakeData}
    columns={[
        {
            title: "First Name",
            width: 25,
            key: "first_name"
        }, {
            title: "Last Name",
            width: 25,
            key: "last_name"
        }, {
            title: "Gender",
            width: 25,
            key: "gender"
        }, {
            title: "IP-address",
            width: 25,
            key: "ip_address"
        },{
            title: "email",
            width: 25,
            key: "email"
        }
    ]}
    bottomRow={false}
/>, document.getElementById( 'react-app' ) );

