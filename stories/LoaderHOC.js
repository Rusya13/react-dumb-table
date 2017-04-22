import React, { Component } from "react";


const LoaderHOC = ( propName ) => ( WrappedComponent ) => {
    return class LoaderHOC extends Component {

        isEmpty( prop ) {
            return (
                prop === null ||
                prop === undefined ||
                (prop.hasOwnProperty( 'length' ) && prop.length === 0) ||
                (prop.constructor === Object && Object.keys( prop ).length === 0)
            )
        }

        render() {
            if ( this.isEmpty( this.props[ propName ] ) ) {
                return <div className="spinWrapper">Loading</div>
            } else {
                return <WrappedComponent {...this.props}/>
            }
        }
    }
};

export default LoaderHOC;