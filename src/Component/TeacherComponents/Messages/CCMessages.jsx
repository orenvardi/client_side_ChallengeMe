import React, { Component } from 'react';
import localHost from '../../LittleComponents/LocalHost';
import '../../../css/Style.css';
import './styleMessages.css'
import Footer from '../../LittleComponents/Footer';
import NavBar from '../../LittleComponents/NavBar';
import $ from 'jquery';
import ProjectContext from '../../../Context/ProjectContext';
import StudentsWithMessage from './CCStudentsWithMessage';

export default class CCMessages extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        let local = true;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/Message';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup2/prod' + '/api/Message';
        }
    }

    static contextType = ProjectContext;

    componentDidMount() {
        
    }

    goToChat = (student) => {
        this.props.history.push({
            pathname: '/Chat',
            state: { student: student }
        })
    }

    // GoToIncomeMessages = () => {
    //     if (this.state.IncomeMessages != true) {
    //         this.setState({ IncomeMessages: true });
    //     }

    // }
    // GoToSendingMessages = () => {
    //     if (this.state.IncomeMessages != false) {
    //         this.setState({ IncomeMessages: false });
    //     }
    // }

    // linkToNewMessage = () => {
    //     this.props.history.push({
    //         pathname: '/NewMessage',
    //     })
    // }

    render() {
        //  let whitch;
        // let textFonts;
        // if (this.state.IncomeMessages == true) {
        //     whitch = <CCIncomeMessages />;
        //     textFonts = <div className="col-12"><div id="INCOMEtext" className="col-6 turkiz floatLeft" onClick={this.GoToIncomeMessages}>הודעות נכנסות</div><div id="SENDINGtext" className="col-6 grey floatLeft" onClick={this.GoToSendingMessages}>הודעות יוצאות</div></div>;
        // }
        // else {
        //     whitch = <CCSendingMessages />;
        //     textFonts = <div className="col-12"><div id="INCOMEtext" className="col-6 grey floatLeft" onClick={this.GoToIncomeMessages}>הודעות נכנסות</div><div id="SENDINGtext" className="col-6 turkiz floatLeft" onClick={this.GoToSendingMessages}>הודעות יוצאות</div></div>;
        // }

        return (
            <div className="container-fluid">

                <NavBar></NavBar>

                <StudentsWithMessage goToChat={this.goToChat} />

                {/* <div className="row col-12 searchDiv">
                    <div className="col-12 turkiz">הודעות</div>
                    <div className="col-8 searchItselfDiv">
                        <input type="text" className="form-control inputRounded" id="search" placeholder="חיפוש"></input>
                    </div>
                    <div className="col-8 addingAlertsDiv" onClick={this.linkToNewMessage}>
                        <h5>שליחת הודעה חדשה</h5>
                    </div>
                    {textFonts}
                </div>
                <div className="allAlerts">
                    {whitch}
                </div> */}

                <Footer></Footer>
            </div>
        );
    };
}



