import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { fakeData } from "./fakeData";
import {SimpleTable} from '../src/index';
import SplitPane from "react-split-pane";



class TestApp extends React.Component{


    constructor(props){
        super(props)
         this.columns = [
             {
                 name:   "First Name",
                 width:   25,
                 key:     "first_name",
                 sortKey: "name"
             }, {
                 name: "Last Name",
                 width: 25,
                 key:   "last_name"
             }, {
                 name: "Gender",
                 width: 25,
                 key:   "gender"
             }, {
                 name: "IP-address",
                 width: 25,
                 key:   "ip_address"
             }, {
                 name: "email",
                 width: 25,
                 key:   "email"
             }
         ];

        this.contextMenu = [
            { title: "Edit row", onClickHandler: () => console.log( "index action menu click" ) },

            { title: "Delete row", onClickHandler: () => console.log( "index action menu click" ) },
            { type:"divider" },
            { title: "Create new", onClickHandler: () => console.log( "index action menu click" ) },
        ]

         this.state={selected : [0]};
    }

    sellClickHandler(row, index, column, buttons){

        console.log("test sellClickHandler", index, column.key, buttons);
        this.setState({selected:[index]})
    }

    reloadPage(){
        this.columns[0].name = "hhhhh"
        this.forceUpdate()
    }


    render(){


        let footerButtons=[
            {title:"New row", onClickHandler:()=>{console.log("test onClickHandler");}, className:"success"}
        ];


        return (
            <SimpleTable
                data={fakeData}
                reloadButtonHandler={() => console.log( "reload" )}
                limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                orderBy="name"
                orderDirection="ASC"
                orderChangeHandler={( key, order ) => {
                    console.log( "index orderChangeHandler", key, order )

                }}
                columns={this.columns}
                bottomRow={false}
                footerButtons={footerButtons}
                sellClickHandler={this.sellClickHandler.bind(this)}
                selectedRowIndexes={this.state.selected}
                contextMenuItems={this.contextMenu}
            />
        )


        return (
            <div className="parent">
                <div className="header">Header</div>
                <div className="wrapper">
                    <SplitPane split="horizontal" minSize={50} defaultSize={400} primary="second">
                            <SimpleTable
                                data={fakeData}
                                reloadButtonHandler={() => console.log( "reload" )}
                                limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                                orderBy="name"
                                orderDirection="ASC"
                                orderChangeHandler={( key, order ) => {
                                    console.log( "index orderChangeHandler", key, order )

                                }}
                                sellClickHandler={this.sellClickHandler.bind(this)}
                                columns={this.columns}
                                bottomRow={false}
                                footerButtons={footerButtons}
                            />
                        <SimpleTable
                            data={fakeData}
                            reloadButtonHandler={() => console.log( "reload" )}
                            limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                            orderBy="name"
                            orderDirection="ASC"
                            orderChangeHandler={( key, order ) => {
                                console.log( "index orderChangeHandler", key, order )

                            }}
                            columns={this.columns}
                            bottomRow={false}
                            footerButtons={footerButtons}
                        />
                    </SplitPane>
                </div>
            </div>


        )
    }
}











ReactDOM.render(<TestApp/>, document.getElementById( 'react-app' ) );