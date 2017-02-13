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

            originalWidth  = newSize;
            originalOffset = newOffset;
            this.forceUpdate()
        }.bind( this );
        document.onmouseup   = function () {
            document.body.className = document.body.className.replace( /(?:^|\s)no-selection(?!\S)/g, '' );
            document.onmousemove    = document.onmouseup = null;
        }.bind( this );
    }

    _renderColumnsSync( columns ) {
        return (
            <colgroup>
                {columns.map( ( col, index ) => {
                    return <col key={index} style={col.width && { width: col.width + "%" || "auto" }}/>
                } )}
            </colgroup>
        )
    }


    render() {
        let columns = this.props.columns;

        return (
            <div id="table" ref={( ref ) => this.tableWrapper = ref} className="data-table">
                <div
                    ref={( ref ) => this.header = ref}
                    className="data-table__header">
                    <table ref={( ref ) => this.table = ref}>
                        {this._renderColumnsSync( columns )}
                        <thead>
                        <tr>
                            {this.props.columns.map( ( col, index ) => {
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
                    </table>
                </div>
                <div className="data-table__content">
                    <table ref={( ref ) => this.tableBody = ref}>
                        {this._renderColumnsSync( columns )}
                        <tbody>
                        {this.props.data.map( ( col, index ) => {
                            return (
                                <tr key={index}>
                                    <td>{col.first_name}</td>
                                    <td>{col.last_name}</td>
                                    <td>{col.email}</td>
                                    <td>{col.gender}</td>
                                </tr>
                            )
                        } )}

                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

}

SimpleDataTable.propTypes = {
    height:  PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    data:    PropTypes.array.isRequired
};

SimpleDataTable.defaultProps = {
    height:  500,
    columns: [],
    data:    []
};


ReactDOM.render( <SimpleDataTable
    data={fakeData}
    columns={[
        {
            title: "First Name",
            width: 25
        }, {
            title: "Last Name",
            width: 25
        }, {
            title: "Last Name",
            width: 25
        }, {
            title: "E-mail",
            width: 25
        }
    ]}
/>, document.getElementById( 'react-app' ) );

