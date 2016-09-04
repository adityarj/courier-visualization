/**
 * Created by HP-PC on 29-08-2016.
 */

var MainApp = React.createClass({
    render: function () {
        return (
            <div is container>
                <div is row>
                    <SidePanel />
                    <SectionMain />
                </div>
            </div>
        );
    }
});

var SidePanel = React.createClass({
    render: function () {
        return (
            <div is column="2">
                <div is container>
                    <div is row>
                        <div id="counterHeader" className="AppHeader">
                            Actual Time
                        </div>
                        <div>
                            <div className="timeTicker">            

                                <p className="timeSegment clear">
                                    <span className="digit" id="count_digit_1">0</span>
                                    <span className="digit" id="count_digit_2" style={{marginRight: '8px'}}>8</span>
                                    <span className="digit" id="count_digit_3">0</span>
                                    <span className="digit" id="count_digit_4">0</span>
                                </p>
                
                            </div>
                        </div>
                        <div id="AcitveHeader" className="AppHeader">
                            Active Couriers
                        </div>
                        <div >
                            <label className="label bg--success AppLabel" id="ActiveCouriers">0</label>
                        </div>    
                        <div id="DeliveredHeader" className="AppHeader">
                            Packages Delivered
                        </div>
                        <div>
                            <label className="label bg--success AppLabel" id="PackageCount">0</label>
                        </div>
                        <div id="LateHeader" className="AppHeader">
                            Late Couriers (+)
                        </div>
                        <div>
                            <label className="label bg--warning AppLabel" id="LateCount">0</label>
                        </div>
                        <div className="AppHeader">
                            Time Penalty
                        </div>
                        <div>
                            <label className="label bg--error AppLabel" id="PunishmentCount">0</label>
                        </div>    
                        <div className="AppHeader">
                            Late Proportion
                        </div>
                        <div>
                            <label style={{width: '65px'}}className="ProportionList bg--primary " id="correctBar">
                            </label>
                            <label style={{width: '60px'}} className="ProportionList bg--error " id="lateBar">
                            </label> 
                        </div>
                        <div id="totalHeader" className="AppHeader">
                            Total Time
                        </div>
                        <div>
                            <div className="timeTicker">            

                                <p className="timeSegment clear">
                                    <span className="digit" id="total_digit_1">0</span>
                                    <span className="digit" id="total_digit_2" style={{marginRight: '8px'}}>8</span>
                                    <span className="digit" id="total_digit_3">0</span>
                                    <span className="digit" id="total_digit_4">0</span>
                                </p>

                            </div>
                        </div>
                        <div style={{height: '60px'}}>
                        </div>
                        <div className="collection" >
                            <div className="collection-header">
                                <h4>Active Courier (Hover)</h4>
                            </div>
                            <div className="collection-item">
                                <h6 id="Cname">-</h6>
                            </div>
                            <div className="collection-item">
                                <h6 id="CNum">-</h6>
                            </div>
                            <div className="collection-item">
                                <h6 id="Cdest">-</h6>
                            </div>
                            <div className="collection-item">
                                <h6 id="COrder">-</h6>
                            </div>
                        </div>
                        <div id = "CloseButton">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var SectionMain = React.createClass({
    componentDidMount: function() {
        $('#GraphData').hide();
    },
    render: function () {
        return (
            <div is column="10">
                <div>
                    <div id="MapImage"></div>
                    <div id="GraphData"></div>
                </div>
                <LowerControls />
            </div>
        );
    }
});

var LowerControls = React.createClass({
    getInitialState: function() {
        return {
            isMap: true
        }
    },
    componentDidMount: function() {
        $('#OntimeList').hide();
    },
    handleSwitch: function() {
        if (this.state.isMap) {
            $('#MapImage').hide();
            $('#GraphData').show();
            this.setState({
                isMap: false
            });
        } else {
            $('#GraphData').hide();
            $('#MapImage').show();
            this.setState({
                isMap: true
            });
        }
    },
    handleShowLate: function() {
        $('#OntimeList').hide();
        $('#LateList').show();
        console.log('late');
    },
    handleShowOT: function() {
        $('#LateList').hide();
        $('#OntimeList').show();
        console.log('OT');
    },
    render: function () {
        return (
            <div>
                <div className="ButtonSubHeaders">
                    <button className="button--collapse" id="PlayButton" >Pause</button>
                    <button className="button--collapse" id="NextButton" >
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </button>
                    <button className="button--collapse bg--muted" id="SwitchButton" onClick={this.handleSwitch}>
                        <i className="fa fa-exchange" aria-hidden="true"></i>
                    </button>                                          
                </div>
                <div id="LateList">
                    <table className="table--hoverRow" id="TableLateList">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Courier</th>
                                <th scope="col">Order</th>
                                <th scope="col">Destination</th>
                                <th scope="col">Packages</th>
                                <th scope="col">Late by (min)</th>
                            </tr>
                        </thead>
                        <tbody id = "AppendLate">
                        </tbody>
                    </table>
                </div>
                <div id="OntimeList">
                    <table className="table--hoverRow" id="TableOT">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Courier</th>
                                <th scope="col">Order</th>
                                <th scope="col">Destination</th>
                                <th scope="col">Packages</th>
                            </tr>
                        </thead>
                        <tbody id = "AppendOT">
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <MainApp />,
    document.getElementById('Main')
);