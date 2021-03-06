import React, { Component } from 'react';
import '../../../css/Style.css';
import './styleStudentHomePage.css';
import ProjectContext from '../../../Context/ProjectContext';
import CCStudentChallenges from './CCStudentChallenges';
import localHost from '../../LittleComponents/LocalHost';
import "animate.css";
import Resizer from 'react-image-file-resizer';
import { RiLogoutBoxLine } from 'react-icons/ri';
import EmptyImgStudentBase64 from '../../LittleComponents/emptyImgStudent';
import Swal from 'sweetalert2';
import $ from 'jquery';
import Confetti from 'react-confetti';
export default class CCStudentHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countMessages: 0,
            FirstAndLastName: { firstName: "", lastName: "" },
            Avatar: null,
            avatarSentances: ["!המשך כך", "!אתה מסוגל", "!תעבור עוד אתגרים כדי שאוכל לגדול", "!אתה תותח"],
            // SuccessCount: 0,
            // ChallengesCount: 0,
            avatarLevel: 1,
            dataUriImageStudent: "",
            dataImg: EmptyImgStudentBase64,
            animationAvatar: 0

        };
        let local = false;
        this.apiUrlMessage = 'http://localhost:' + { localHost }.localHost + '/api/Message';
        this.apiUrlStudent = 'http://localhost:' + { localHost }.localHost + '/api/Student';
        if (!local) {
            this.apiUrlMessage = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Message';
            this.apiUrlStudent = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Student';
        }
        this.getFiles = this.getFiles.bind(this);
    }

    static contextType = ProjectContext;

    componentDidMount() {
        this.getImage();
        this.getNameAndAvatarNum();
        this.getSuccessCount();
        this.getDataOfMessagesNum();
        setInterval(this.getDataOfMessagesNum, 5000); // runs every 5 seconds.
    }

    goToChallengePage = (challenge, index) => {
        this.props.history.push({
            pathname: '/ChallengePage',
            state: { challenge: challenge, index: index }
        })
    }

    getImage = () => {
        const user = this.context;
        fetch(this.apiUrlStudent + '/ImageStudent?studentID=' + user.studentID
            , {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                console.log('res=', res);
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    //console.log(result);
                    this.setState({ dataImg: result })
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                })

    }

    getNameAndAvatarNum = () => {
        const user = this.context;
        console.log(user.studentID);
        fetch(this.apiUrlStudent + '?studentIDGivesName=' + user.studentID
            , {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                console.log('res=', res);
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("NameAndAvatarID= ", result[0]);
                    this.setState({ FirstAndLastName: { firstName: result[0].firstName, lastName: result[0].lastName }, Avatar: result[0].avatar });
                    if (result[0].avatar == null)
                        this.props.history.push('/ChooseAvatar')
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'אנא נסו להכנס שוב לאפליקציה',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                });
    }
    getSuccessCount = () => {
        const user = this.context;
        console.log(user.studentID);
        fetch(this.apiUrlStudent + '/SuccessCount?studentID=' + user.studentID
            , {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                console.log('res=', res);
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("count= ", result);
                    var avatarLevel = (result[0] == 0 || result[1] == 0) ? 1 : Math.max(Math.ceil(result[0] / result[1] * 100 / 20), 1) //מינימום 1
                    this.setState({
                        // SuccessCount: result[0],  //כמה אתגרים התלמיד הצליח
                        // ChallengesCount: result[1], //כמה אתגרים שוייכו לתלמיד
                        avatarLevel: avatarLevel
                    });
                    if (user.successCount != "" && user.successCount != result[0]) { //אם כמות האתגרים שהתלמיד הצליח השתנתה
                        if (user.successCount + 1 == result[0]) { // האם היא השתנה לאחד מעל מה שהיה קודם
                            if (user.avatarLevel == avatarLevel) { // האם הרמה של התלמיד עדיין נשארה אותו דבר
                                if (result[0] == result[1]) {
                                    //תוקן
                                    Swal.fire({
                                        title: '!כל הכבוד',
                                        text: ' !!!!סיימת את כללל האתגרים שלך בהצלחה',
                                        // icon: 'success',
                                        confirmButtonColor: '#e0819a',
                                        imageUrl: require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + this.state.avatarLevel + '.png'),
                                        imageHeight: 150,
                                        imageAlt: 'A tall image'
                                    });
                                    this.setState({ confetti: true });
                                    setTimeout(async function () {
                                        this.setState({ confetti: false });
                                    }.bind(this), 4000);
                                }
                                else
                                    //תוקן
                                    Swal.fire({
                                        title: '!כל הכבוד',
                                        text: '!אתה מצוין! תמשיך ככה',
                                        // icon: 'success',
                                        confirmButtonColor: '#e0819a',
                                        imageUrl: require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + this.state.avatarLevel + '.png'),
                                        imageHeight: 150,
                                        imageAlt: 'A tall image'
                                    });
                            }
                            else {  // האם רמת התלמיד השתנתה בעקבות השינוי בכמות האתגרים שהצליח
                                // alert(`כמות האתגרים שהתלמיד הצליח השתנתה, קודם היא הייתה ${user.successCount}
                                // ועכשיו היא ${result[0]} וגם רמת התלמיד השתנתה, קודם היא הייתה ${user.avatarLevel}
                                // ועכשיו היא ${avatarLevel}`);
                                //כאן יתחיל האנימציה
                                this.setState({ animationAvatar: 1 });
                                setTimeout(async function () {
                                    this.setState({ animationAvatar: 2, confetti: true });
                                }.bind(this), 2500);
                                setTimeout(async function () {
                                    this.setState({ animationAvatar: 0, confetti: false });

                                }.bind(this), 6000);
                                if (result[0] == result[1]) {
                                    setTimeout(async function () {
                                        //תוקן
                                        Swal.fire({
                                            title: '!כל הכבוד',
                                            text: ' !!!!סיימת את כללל האתגרים שלך בהצלחה',
                                            // icon: 'success',
                                            confirmButtonColor: '#e0819a',
                                            imageUrl: require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + this.state.avatarLevel + '.png'),
                                            imageHeight: 150,
                                            imageAlt: 'A tall image'
                                        });
                                        this.setState({ confetti: true });
                                        setTimeout(async function () {
                                            this.setState({ confetti: false });
                                        }.bind(this), 2000);
                                    }.bind(this), 6500);
                                }
                            }
                        }
                    };

                    user.setSuccessCount(result[0]); //כמה אתגרים התלמיד הצליח
                    user.setChallengesCount(result[1]); //כמה אתגרים שוייכו לתלמיד
                    user.setAvatarLevel(avatarLevel);
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                });
    }

    getDataOfMessagesNum = () => {// runs every 30 seconds  משיכה של מספר ההודעה שלא נקראו
        const user = this.context;

        fetch(this.apiUrlMessage + '?studentID_UnRead=' + user.studentID
            , {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                console.log('res=', res);
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("countMessages= ", result);
                    if (result > 0 && this.state.countMessages !== result)
                        this.setState({ countMessages: result });
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                });
    }

    getFiles = (e) => {
        var fileInput = false;
        if (e.target.files[0]) {
            fileInput = true;
        }
        if (fileInput) {
            Resizer.imageFileResizer(
                e.target.files[0], //is the file of the new image that can now be uploaded...
                300, // is the maxWidth of the  new image
                300, // is the maxHeight of the  new image
                'PNG', // is the compressFormat of the  new image
                50, // is the quality of the  new image
                0, // is the rotatoion of the  new image
                uri => { this.saveImg(uri); },  // is the callBack function of the new image URI
                'base64'  // is the output type of the new image
            );

        }
    }

    saveImg = (uri) => {
        this.setState({ dataUriImageStudent: uri });
        console.log(uri)
        const user = this.context;
        var data = {
            image: uri,
            studentID: user.studentID,
        }
        fetch(this.apiUrlStudent + "/AddImgStudent"
            , {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8'
                })
            })
            .then(res => {
                console.log('res=', res);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    this.getImage();
                },
                (error) => {
                    console.log("err post=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'התמונה לא נשמרה, אנא נסה שנית',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                });
    }

    logout = async () => {
        const user = await this.context;

        var data = await {
            studentID: user.studentID,
            studentToken: ""
        }

        await fetch(this.apiUrlStudent + '/studentToken', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', res);
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                },
                (error) => {
                    console.log("err post=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                });

        await sessionStorage.clear();
        await localStorage.clear();
        await this.props.history.push('/');
    }


    render() {
        const user = this.context;
        var token = user.studentToken;
        var RandomNumber = Math.floor(Math.random() * this.state.avatarSentances.length) + 0;
        var levelAvatarBefore = this.state.avatarLevel - 1;
        // const [width, height] = useWindowSize()
        return (
            <div className="studentPage">
                <div className="d-flex justify-content-start" style={{ padding: '2% 0 0 2%', color: 'rgb(46, 46, 124)' }}
                    onClick={this.logout}>
                    <RiLogoutBoxLine color='rgb(46, 46, 124)' size={25} style={{ marginRight: '2%' }} /> התנתק
                </div>
                {/* פרטי התלמיד */}
                <div className="headLineHomePage row" dir="rtl">
                    <input type="file" id="fileImgStudent" onChange={this.getFiles} />
                    <label for="fileImgStudent" className="lableImg">
                        <img className="emptyUserImg" style={{ margin: '5px' }} src={`data:image/jpeg;base64,${this.state.dataImg}`} />
                    </label>
                    <div className="row helloName"> היי {this.state.FirstAndLastName.firstName} {this.state.FirstAndLastName.lastName},</div>
                </div>
                {/* <br /> */}

                {/* הודעות של התלמיד */}
                <div onClick={() => this.props.history.push('/StudentChat', { FirstAndLastName: this.state.FirstAndLastName })} className="messagesS col-12 d-flex align-items-center justify-content-center" >
                    <div>
                        <div className="btnMassagesReadText"> יש לך {this.state.countMessages} הודעות חדשות</div>
                        <div ><button className="btn btn-info btnYellow roundedBtn btnMassagesRead">לקריאה לחץ כאן</button></div>
                    </div>
                </div>

                {/* האתגרים של התלמיד */}
                <CCStudentChallenges goToChallengePage={this.goToChallengePage} />

                {/* אווטאר */}
                {
                    this.state.Avatar != null && this.state.animationAvatar == 0 &&

                    <div className="row" style={{ margin: '0px', marginTop: '2%', padding: '0px' }}>
                        <div className="animated bounce infinite col-4 avatarClassDiv" > <img src={require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + this.state.avatarLevel + '.png')} /></div>
                        <div className="animated fadeIn delay-1s col-6" id="talkbubble">{this.state.avatarSentances[RandomNumber]}</div>

                    </div>
                }
                {
                    this.state.Avatar != null && this.state.animationAvatar == 1 &&
                    <div id="animateAvatar" className="avatarClassDiv col-2">
                        <div className="avatarClassDiv animated bounceOut delay-3s" ><img src={require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + levelAvatarBefore + '.png')} /></div>
                    </div>
                }
                {
                    this.state.Avatar != null && this.state.confetti == true &&
                    <div className="row">
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                        />

                    </div>
                }
                {
                    this.state.Avatar != null && this.state.animationAvatar == 2 &&
                    <div id="animateAvatar2" className="col-2">
                        <div className="avatarClassDiv animated bounceIn animated tada delay-1s" > <img src={require('../../../img/avatars/' + this.state.Avatar + '/' + this.state.Avatar + this.state.avatarLevel + '.png')} /></div>
                        <audio
                            ref="audio_tag"
                            autoPlay={true}
                            controls={false} >
                            <source type="audio/mp3" src="/successfulAudio.mp3" />
                        </audio>
                    </div>
                }


            </div>
        )
    };
}

