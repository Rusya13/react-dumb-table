import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { fakeData } from "./fakeData";
import {SimpleDataTable} from './index';



class TestApp extends React.Component{


    reloadPage(){
        this.forceUpdate()
    }

    render(){

        let columns = [
            {
                title:   "First Name",
                width:   25,
                key:     "first_name",
                sortKey: "name"
            }, {
                title: "Last Name",
                width: 25,
                key:   "last_name"
            }, {
                title: "Gender",
                width: 25,
                key:   "gender"
            }, {
                title: "IP-address",
                width: 25,
                key:   "ip_address"
            }, {
                title: "email",
                width: 25,
                key:   "email"
            }
        ];
        let footerButtons=[
            {title:"New row", onClickHandler:()=>{console.log("test onClickHandler");}, className:"success"}
        ];


        return (
            <div>
                <SimpleDataTable
                    data={fakeData}
                    reloadButtonHandler={() => console.log( "reload" )}
                    limitSelectorHandler={( limit ) => console.log( "new limit:", limit )}
                    rowSelectHandler={( row, index ) => console.log( "index rowSelectHandler", row, index )}
                    orderBy="name"
                    orderDirection="ASC"
                    orderChangeHandler={( key, order ) => {
                        console.log( "index orderChangeHandler", key, order )

                    }}
                    columns={columns}
                    bottomRow={false}
                    footerButtons={footerButtons}
                />
                <br/>
                <button onClick={this.reloadPage.bind(this)}>Reload</button>
            </div>

        )
    }
}











ReactDOM.render(<TestApp/>, document.getElementById( 'react-app' ) );