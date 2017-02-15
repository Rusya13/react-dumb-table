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
                 width:   20,
                 key:     "first_name",
                 sortKey: "name"
             }, {
                 name: "Last Name",
                 width: 20,
                 key:   "last_name"
             }, {
                 name: "Gender",
                 width: 20,
                 key:   "gender"
             }, {
                 name: "IP-address",
                 width: 20,
                 key:   "ip_address"
             }, {
                 name: "email",
                 width: 20,
                 key:   "email"
             }
         ];



    }

    getContextMenu(){
        return [
            {title:"Edit", onClickHandler:()=>console.log("index action menu click edit")},
            {title:"Delete", onClickHandler:()=>console.log("index action menu click delete")},
            ]
    }

    reloadPage(){
        this.columns[0].name = "hhhhh"
        this.forceUpdate()
    }


    render(){


        let footerButtons=[
            {title:"New row", onClickHandler:()=>{console.log("test onClickHandler");}, className:"success"}
        ];


        //return (
        //    <SimpleTable
        //        data={fakeData}
        //        reloadButtonHandler={() => console.log( "reload" )}
        //        limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
        //        rowSelectHandler={( row, index ) => console.log( "index rowSelectHandler", row, index )}
        //        orderBy="name"
        //        orderDirection="ASC"
        //        orderChangeHandler={( key, order ) => {
        //            console.log( "index orderChangeHandler", key, order )
        //
        //        }}
        //        columns={this.columns}
        //        bottomRow={false}
        //        footerButtons={footerButtons}
        //        contextMenuItems={this.getContextMenu()}
        //    />
        //)


        return (
            <div className="parent">
                <div className="header">Header</div>
                <div className="wrapper">
                    <SplitPane split="horizontal" minSize={50} defaultSize={400} primary="second">
                            <SimpleTable
                                data={fakeData}
                                reloadButtonHandler={() => console.log( "reload" )}
                                limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                                rowSelectHandler={( row, index ) => console.log( "index rowSelectHandler", row, index )}
                                orderBy="name"
                                orderDirection="ASC"
                                orderChangeHandler={( key, order ) => {
                                    console.log( "index orderChangeHandler", key, order )

                                }}
                                columns={this.columns}
                                bottomRow={false}
                                footerButtons={footerButtons}
                            />
                        <SimpleTable
                            data={fakeData}
                            reloadButtonHandler={() => console.log( "reload" )}
                            limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                            rowSelectHandler={( row, index ) => console.log( "index rowSelectHandler", row, index )}
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