import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

const data = [
        {"id":1,"first_name":"Catherine","last_name":"Bowman","email":"cbowman0@comsenz.com","gender":"Female","ip_address":"45.19.237.206"},
        {"id":2,"first_name":"Jean","last_name":"Cooper","email":"jcooper1@theglobeandmail.com","gender":"Female","ip_address":"250.106.37.202"},
        {"id":3,"first_name":"Joe","last_name":"Flores","email":"jflores2@twitpic.com","gender":"Male","ip_address":"112.238.129.88"},
        {"id":4,"first_name":"Carlos","last_name":"Lynch","email":"clynch3@wisc.edu","gender":"Male","ip_address":"6.58.118.172"},
        {"id":5,"first_name":"Heather","last_name":"Gardner","email":"hgardner4@about.com","gender":"Female","ip_address":"241.206.22.229"},
        {"id":6,"first_name":"Terry","last_name":"Bowman","email":"tbowman5@dailymotion.com","gender":"Male","ip_address":"149.102.43.13"},
        {"id":7,"first_name":"Billy","last_name":"Woods","email":"bwoods6@scribd.com","gender":"Male","ip_address":"10.175.55.113"},
        {"id":8,"first_name":"Marie","last_name":"Chavez","email":"mchavez7@jugem.jp","gender":"Female","ip_address":"136.45.31.108"},
        {"id":9,"first_name":"Amy","last_name":"Johnston","email":"ajohnston8@w3.org","gender":"Female","ip_address":"76.245.31.145"},
        {"id":10,"first_name":"Gregory","last_name":"Duncan","email":"gduncan9@technorati.com","gender":"Male","ip_address":"63.162.142.204"},
        {"id":11,"first_name":"Roger","last_name":"Johnson","email":"rjohnsona@zdnet.com","gender":"Male","ip_address":"35.169.224.106"},
        {"id":12,"first_name":"Mark","last_name":"James","email":"mjamesb@wikipedia.org","gender":"Male","ip_address":"70.209.205.82"},
        {"id":13,"first_name":"Ann","last_name":"Graham","email":"agrahamc@boston.com","gender":"Female","ip_address":"185.82.159.86"},
        {"id":14,"first_name":"Joshua","last_name":"Hunt","email":"jhuntd@marriott.com","gender":"Male","ip_address":"7.37.200.116"},
        {"id":15,"first_name":"Fred","last_name":"Carr","email":"fcarre@about.com","gender":"Male","ip_address":"52.222.34.48"},
        {"id":16,"first_name":"Martin","last_name":"Garza","email":"mgarzaf@sourceforge.net","gender":"Male","ip_address":"250.89.40.42"},
        {"id":17,"first_name":"Amy","last_name":"Black","email":"ablackg@un.org","gender":"Female","ip_address":"82.129.145.171"},
        {"id":18,"first_name":"Gloria","last_name":"Franklin","email":"gfranklinh@goo.ne.jp","gender":"Female","ip_address":"102.186.93.251"},
        {"id":19,"first_name":"Andrea","last_name":"Day","email":"adayi@cloudflare.com","gender":"Female","ip_address":"49.191.50.231"},
        {"id":20,"first_name":"Clarence","last_name":"Riley","email":"crileyj@theatlantic.com","gender":"Male","ip_address":"217.175.13.238"},
        {"id":21,"first_name":"Craig","last_name":"Wagner","email":"cwagnerk@bravesites.com","gender":"Male","ip_address":"36.49.228.88"},
        {"id":22,"first_name":"Emily","last_name":"Jenkins","email":"ejenkinsl@apple.com","gender":"Female","ip_address":"34.88.51.98"},
        {"id":23,"first_name":"Stephanie","last_name":"Stevens","email":"sstevensm@uol.com.br","gender":"Female","ip_address":"212.30.48.194"},
        {"id":24,"first_name":"Chris","last_name":"Collins","email":"ccollinsn@usda.gov","gender":"Male","ip_address":"228.154.190.193"},
        {"id":25,"first_name":"Ralph","last_name":"Freeman","email":"rfreemano@whitehouse.gov","gender":"Male","ip_address":"243.129.76.241"},
        {"id":26,"first_name":"William","last_name":"Sims","email":"wsimsp@bandcamp.com","gender":"Male","ip_address":"2.144.84.100"},
        {"id":27,"first_name":"Patricia","last_name":"Frazier","email":"pfrazierq@smugmug.com","gender":"Female","ip_address":"76.66.40.116"},
        {"id":28,"first_name":"Susan","last_name":"Kelley","email":"skelleyr@fc2.com","gender":"Female","ip_address":"165.221.161.74"},
        {"id":29,"first_name":"Ernest","last_name":"Reed","email":"ereeds@blogs.com","gender":"Male","ip_address":"68.103.56.83"},
        {"id":30,"first_name":"Janice","last_name":"Moreno","email":"jmorenot@creativecommons.org","gender":"Female","ip_address":"128.134.157.246"},
        {"id":31,"first_name":"Carol","last_name":"Wilson","email":"cwilsonu@rambler.ru","gender":"Female","ip_address":"35.238.76.194"},
        {"id":32,"first_name":"Todd","last_name":"Harper","email":"tharperv@t-online.de","gender":"Male","ip_address":"164.22.211.115"},
        {"id":33,"first_name":"Melissa","last_name":"Crawford","email":"mcrawfordw@adobe.com","gender":"Female","ip_address":"40.98.219.2"},
        {"id":34,"first_name":"John","last_name":"Garrett","email":"jgarrettx@guardian.co.uk","gender":"Male","ip_address":"173.194.109.216"},
        {"id":35,"first_name":"Russell","last_name":"Mccoy","email":"rmccoyy@nba.com","gender":"Male","ip_address":"3.106.132.251"},
        {"id":36,"first_name":"Lawrence","last_name":"Jackson","email":"ljacksonz@eventbrite.com","gender":"Male","ip_address":"222.211.4.240"},
        {"id":37,"first_name":"Virginia","last_name":"Duncan","email":"vduncan10@sourceforge.net","gender":"Female","ip_address":"246.175.78.214"},
        {"id":38,"first_name":"Fred","last_name":"Matthews","email":"fmatthews11@reddit.com","gender":"Male","ip_address":"135.147.99.172"},
        {"id":39,"first_name":"Russell","last_name":"Ellis","email":"rellis12@hugedomains.com","gender":"Male","ip_address":"220.163.203.7"},
        {"id":40,"first_name":"Ronald","last_name":"Banks","email":"rbanks13@hatena.ne.jp","gender":"Male","ip_address":"237.16.169.29"},
        {"id":41,"first_name":"Wanda","last_name":"Garrett","email":"wgarrett14@wisc.edu","gender":"Female","ip_address":"40.64.156.78"},
        {"id":42,"first_name":"Benjamin","last_name":"Sanders","email":"bsanders15@berkeley.edu","gender":"Male","ip_address":"56.247.83.148"},
        {"id":43,"first_name":"Donald","last_name":"Stewart","email":"dstewart16@php.net","gender":"Male","ip_address":"126.77.254.109"},
        {"id":44,"first_name":"Christina","last_name":"Patterson","email":"cpatterson17@nifty.com","gender":"Female","ip_address":"124.248.51.212"},
        {"id":45,"first_name":"Walter","last_name":"Tucker","email":"wtucker18@bizjournals.com","gender":"Male","ip_address":"43.99.4.19"},
        {"id":46,"first_name":"Brenda","last_name":"Burke","email":"bburke19@scientificamerican.com","gender":"Female","ip_address":"134.34.65.144"},
        {"id":47,"first_name":"Antonio","last_name":"Reyes","email":"areyes1a@phoca.cz","gender":"Male","ip_address":"79.187.158.178"},
        {"id":48,"first_name":"Maria","last_name":"West","email":"mwest1b@redcross.org","gender":"Female","ip_address":"234.39.218.105"},
        {"id":49,"first_name":"Katherine","last_name":"Mcdonald","email":"kmcdonald1c@photobucket.com","gender":"Female","ip_address":"126.26.71.150"},
        {"id":50,"first_name":"Jason","last_name":"Dean","email":"jdean1d@cyberchimps.com","gender":"Male","ip_address":"10.3.120.191"},
        {"id":51,"first_name":"Melissa","last_name":"Ellis","email":"mellis1e@histats.com","gender":"Female","ip_address":"213.244.102.248"},
        {"id":52,"first_name":"Tammy","last_name":"Hamilton","email":"thamilton1f@netvibes.com","gender":"Female","ip_address":"92.175.89.245"},
        {"id":53,"first_name":"Rebecca","last_name":"Jordan","email":"rjordan1g@admin.ch","gender":"Female","ip_address":"11.214.0.95"},
        {"id":54,"first_name":"Richard","last_name":"Hill","email":"rhill1h@csmonitor.com","gender":"Male","ip_address":"233.236.175.78"},
        {"id":55,"first_name":"Earl","last_name":"Rodriguez","email":"erodriguez1i@rambler.ru","gender":"Male","ip_address":"209.28.61.19"},
        {"id":56,"first_name":"Kathy","last_name":"Medina","email":"kmedina1j@toplist.cz","gender":"Female","ip_address":"75.84.19.27"},
        {"id":57,"first_name":"Shawn","last_name":"Moore","email":"smoore1k@cbc.ca","gender":"Male","ip_address":"69.48.62.235"},
        {"id":58,"first_name":"Howard","last_name":"Sims","email":"hsims1l@spotify.com","gender":"Male","ip_address":"111.220.60.216"},
        {"id":59,"first_name":"Steven","last_name":"Harvey","email":"sharvey1m@independent.co.uk","gender":"Male","ip_address":"121.100.173.134"},
        {"id":60,"first_name":"Virginia","last_name":"Bell","email":"vbell1n@fc2.com","gender":"Female","ip_address":"134.136.47.228"},
        {"id":61,"first_name":"Phillip","last_name":"Bishop","email":"pbishop1o@wikispaces.com","gender":"Male","ip_address":"196.123.166.113"},
        {"id":62,"first_name":"Roger","last_name":"Dixon","email":"rdixon1p@nature.com","gender":"Male","ip_address":"99.221.70.50"},
        {"id":63,"first_name":"Alice","last_name":"Franklin","email":"afranklin1q@mysql.com","gender":"Female","ip_address":"179.83.204.133"},
        {"id":64,"first_name":"Scott","last_name":"Ford","email":"sford1r@github.com","gender":"Male","ip_address":"31.70.14.36"},
        {"id":65,"first_name":"Matthew","last_name":"Gomez","email":"mgomez1s@yolasite.com","gender":"Male","ip_address":"247.185.253.125"},
        {"id":66,"first_name":"Roger","last_name":"Wright","email":"rwright1t@hp.com","gender":"Male","ip_address":"240.27.183.104"},
        {"id":67,"first_name":"Phyllis","last_name":"Snyder","email":"psnyder1u@spotify.com","gender":"Female","ip_address":"36.138.63.1"},
        {"id":68,"first_name":"Mary","last_name":"Snyder","email":"msnyder1v@twitpic.com","gender":"Female","ip_address":"148.245.59.131"},
        {"id":69,"first_name":"Carolyn","last_name":"Fernandez","email":"cfernandez1w@eventbrite.com","gender":"Female","ip_address":"3.112.136.249"},
        {"id":70,"first_name":"Bruce","last_name":"Kelly","email":"bkelly1x@java.com","gender":"Male","ip_address":"66.29.216.44"},
        {"id":71,"first_name":"Marie","last_name":"King","email":"mking1y@wordpress.org","gender":"Female","ip_address":"209.170.69.73"},
        {"id":72,"first_name":"Heather","last_name":"Brooks","email":"hbrooks1z@taobao.com","gender":"Female","ip_address":"179.254.156.191"},
        {"id":73,"first_name":"Martin","last_name":"Kelly","email":"mkelly20@freewebs.com","gender":"Male","ip_address":"192.197.75.174"},
        {"id":74,"first_name":"Cynthia","last_name":"Brown","email":"cbrown21@lulu.com","gender":"Female","ip_address":"210.224.49.187"},
        {"id":75,"first_name":"Jessica","last_name":"Hill","email":"jhill22@prnewswire.com","gender":"Female","ip_address":"255.245.177.179"},
        {"id":76,"first_name":"Douglas","last_name":"Carroll","email":"dcarroll23@ucoz.ru","gender":"Male","ip_address":"131.64.208.120"},
        {"id":77,"first_name":"David","last_name":"Howell","email":"dhowell24@mozilla.com","gender":"Male","ip_address":"131.214.64.162"},
        {"id":78,"first_name":"Wanda","last_name":"Gomez","email":"wgomez25@digg.com","gender":"Female","ip_address":"168.187.148.125"},
        {"id":79,"first_name":"Tina","last_name":"Nguyen","email":"tnguyen26@multiply.com","gender":"Female","ip_address":"154.169.206.242"},
        {"id":80,"first_name":"Annie","last_name":"Rodriguez","email":"arodriguez27@hc360.com","gender":"Female","ip_address":"213.28.169.247"},
        {"id":81,"first_name":"Theresa","last_name":"Rogers","email":"trogers28@nytimes.com","gender":"Female","ip_address":"98.144.140.74"},
        {"id":82,"first_name":"Robin","last_name":"Martinez","email":"rmartinez29@accuweather.com","gender":"Female","ip_address":"141.155.6.102"},
        {"id":83,"first_name":"Joe","last_name":"Alvarez","email":"jalvarez2a@kickstarter.com","gender":"Male","ip_address":"63.156.241.198"},
        {"id":84,"first_name":"Helen","last_name":"Carter","email":"hcarter2b@sitemeter.com","gender":"Female","ip_address":"215.39.114.160"},
        {"id":85,"first_name":"Samuel","last_name":"Myers","email":"smyers2c@artisteer.com","gender":"Male","ip_address":"100.83.200.136"},
        {"id":86,"first_name":"Jonathan","last_name":"Mendoza","email":"jmendoza2d@ucla.edu","gender":"Male","ip_address":"171.194.44.18"},
        {"id":87,"first_name":"Betty","last_name":"Moore","email":"bmoore2e@psu.edu","gender":"Female","ip_address":"33.95.229.109"},
        {"id":88,"first_name":"Gloria","last_name":"Butler","email":"gbutler2f@examiner.com","gender":"Female","ip_address":"160.223.224.136"},
        {"id":89,"first_name":"Shirley","last_name":"Mcdonald","email":"smcdonald2g@va.gov","gender":"Female","ip_address":"48.86.62.24"},
        {"id":90,"first_name":"Antonio","last_name":"White","email":"awhite2h@cdc.gov","gender":"Male","ip_address":"122.209.183.77"},
        {"id":91,"first_name":"Howard","last_name":"Hart","email":"hhart2i@jugem.jp","gender":"Male","ip_address":"141.71.84.88"},
        {"id":92,"first_name":"Harold","last_name":"Bryant","email":"hbryant2j@hud.gov","gender":"Male","ip_address":"95.61.98.244"},
        {"id":93,"first_name":"Matthew","last_name":"Hart","email":"mhart2k@independent.co.uk","gender":"Male","ip_address":"179.172.163.123"},
        {"id":94,"first_name":"Douglas","last_name":"Wallace","email":"dwallace2l@icq.com","gender":"Male","ip_address":"148.70.43.126"},
        {"id":95,"first_name":"Jeremy","last_name":"Banks","email":"jbanks2m@bizjournals.com","gender":"Male","ip_address":"201.228.86.7"},
        {"id":96,"first_name":"Lawrence","last_name":"Carter","email":"lcarter2n@netvibes.com","gender":"Male","ip_address":"11.155.15.77"},
        {"id":97,"first_name":"Joshua","last_name":"Morrison","email":"jmorrison2o@constantcontact.com","gender":"Male","ip_address":"133.135.129.198"},
        {"id":98,"first_name":"Michael","last_name":"Howell","email":"mhowell2p@usa.gov","gender":"Male","ip_address":"30.159.204.93"},
        {"id":99,"first_name":"Nicholas","last_name":"Carter","email":"ncarter2q@npr.org","gender":"Male","ip_address":"49.2.179.242"},
        {"id":100,"first_name":"Donald","last_name":"Porter","email":"dporter2r@delicious.com","gender":"Male","ip_address":"155.111.211.44"}
];

class ResizeHandle extends React.Component {

    constructor(props) {
        super(props);

        this.changePositionResize = this.changePositionResize.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.state = {
            left: 100
        };
    }

    changePositionResize(coords){
        this.setState({ left: coords });
    }

    handleMouseDown(e){
        const header = this.props.getHeader();
        const resize = this.refs.resize;

        const resizeCoords = this.getCoords(resize);
        const headerCoords = this.getCoords(header);

        const shiftX = e.pageX - resizeCoords.left;

        document.onmousemove = function (e) {
            let newLeft = e.pageX - shiftX - headerCoords.left;

            if (newLeft < 0) {
                newLeft = 0;
            }

            let rightEdge = header.offsetWidth - resize.offsetWidth;

            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }

            this.changePositionResize(newLeft);
        }.bind(this);
    }

    getCoords(e){
        var element = e.getBoundingClientRect();

        return {
            top: element.top + pageYOffset,
            left: element.left + pageXOffset
        };
    }

    handleMouseUp(){

    }

    render(){
       return(
           <div
               ref="resize"
               style={{ left: this.state.left }}
               className="resize-handle"
               onMouseDown={this.handleMouseDown}
               onMouseUp={this.handleMouseUp}
           />
       )
    }
}






class TableHeaderColumns extends React.Component {

    constructor(props) {
        super(props);

        // this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    // handleMouseOver(e){
    //     console.log(e.offsetX, e.nativeEvent.offsetX);
    // }

    render() {
        const { columns } = this.props;

        return (
            <thead>
                <tr>
                    {columns.map((col, index) => {
                        return (
                            <th  key={index}>

                                <div className="box">{col.title}</div>
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    }

}

class SimpleDataTable extends React.Component {

    constructor(props){
        super(props);

        this.handleSizeColumns = this.handleSizeColumns.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.getCoords = this.getCoords.bind(this);

        window.table = this;

        this.state = {
            left: 100,
            width: null,
            columns: props.columns
        };
    }

    componentDidMount(){
        this.state.width = this.table.getBoundingClientRect().width;

        let count = 0,
            summ = 0;

        this.state.columns.forEach((col) => {
            if(col.width){
                summ += col.width;
                count++;
            }
        });

        let colWidth = (this.state.width - summ) / count;

        this.state.columns.forEach((col) => {
            if(!col.width){
                col.width = colWidth;
            }
        });
    }

    handleSizeColumns(){

    }

    handleMouseDown(e){
        const resizeCoords = this.getCoords(this.resizeHandle);
        const headerCoords = this.getCoords(this.header);

        const shiftX = e.pageX - resizeCoords.left;

        document.onmousemove = function (e) {
            let newLeft = e.pageX - shiftX - headerCoords.left;

            if (newLeft < 0) {
                newLeft = 0;
            }

            let rightEdge = this.header.offsetWidth - this.resizeHandle.offsetWidth;

            if (newLeft > rightEdge) {
                newLeft = rightEdge;
            }

            this.setState({ left: newLeft });
        }.bind(this);

        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null;
        };
    }

    handleMouseOver(event){
        // global click
        let x = event.clientX;
        let l = this.header.getBoundingClientRect().left;

        console.log(x-l);



        // let e = event.nativeEvent;
        // // let target = e.target;
        //
        // console.log(x, e);

        // console.log(event.nativeEvent);

        //
        // function checkElement(t){
        //     console.log(t);
        //
        //     return t.id == 'header' ? t.offsetX : checkElement(t.parentElement);
        // }
        //
        //
        // console.log(checkElement(target));

        // console.log(this);
        // event.stopPropagation();
        // console.log(event.relatedTarget);

        // var x = event.nativeEvent.offsetX==undefined?event.nativeEvent.layerX:event.nativeEvent.offsetX;
        // var y = event.nativeEvent.offsetY==undefined?event.nativeEvent.layerY:event.nativeEvent.offsetY;
        // console.log(x +'x'+ y);
    }

    getCoords(e){
        var element = e.getBoundingClientRect();

        return {
            top: element.top + pageYOffset,
            left: element.left + pageXOffset
        };
    }

    render(){
        const { height } = this.props;

        return (
            <div className="data-table" style={{ height }}>
                <div
                    ref={(ref) => this.header = ref}
                    id="header"

                    onMouseOverCapture={this.handleMouseOver}
                    className="data-table__header">
                    <table ref={(ref) => this.table = ref} style={this.state.width && { width: this.state.width }}>
                        <colgroup>
                            {this.state.columns.map((col, index) => {
                                return <col key={index} style={col.width && {width: col.width}}/>
                            })}
                        </colgroup>
                        <TableHeaderColumns
                            columns={this.state.columns}/>
                    </table>
                    <div
                        ref={(ref) => this.resizeHandle = ref}
                        onMouseDown={this.handleMouseDown}
                        style={{ left: this.state.left }}
                        className="resize-handle"/>
                </div>
            </div>
        )

    }

}

SimpleDataTable.propTypes = {
    height: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};

SimpleDataTable.defaultProps = {
    height: 500,
    columns: [],
    data: []
};








ReactDOM.render(<SimpleDataTable
    data={data}
    columns={[
        {
            title: "First Name",
            width: 100
        },{
            title: "Last Name"
        }, {
            title: "Last Name"
        },{
            title: "E-mail",
            width: 100
        }
    ]}
    />, document.getElementById('react-app'));



        // {/*return(*/}
        //    {/*<div className="table-simple">*/}
        //         {/*<div className="table-simple__header" ref="header">*/}
        //             {/*<table>*/}
        //                 {/*<colgroup>*/}
        //                     {/*{columns.map((col, index) => {*/}
        //                         {/*return (*/}
        //                             {/*<col style={col.width && { width: col.width }} key={index}/>*/}
        //                         {/*)*/}
        //                     {/*})}*/}
        //                 {/*</colgroup>*/}
        //                 {/*<thead>*/}
        //                     {/*<tr>*/}
        //                         {/*{columns.map((col, index) => {*/}
        //                             {/*return (*/}
        //                                 {/*<th key={index}>*/}
        //                                     {/*{col.title}*/}
        //                                 {/*</th>*/}
        // //                             )
        // //                         })}
        // //                     </tr>
        // //                 </thead>
        // //             </table>
        // //             <ResizeHandle getHeader={this.getHeader} onChangePosition={this.handePosition}/>
        // //         </div>
        // //    </div>
        // // )
