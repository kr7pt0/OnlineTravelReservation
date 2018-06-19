import React, {Component} from 'react';
import {Route, withRouter, Switch, Link, Redirect} from 'react-router-dom';
import AdminHome from "./admin/AdminHome";
import UserPaymentPage from "./user/UserPaymentPage";

import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./user/Home";

import '../design/css/home.css'

import * as API from "../api/API";

import UserHome from "./user/UserHome";

import "../css/bootstrap.min.css"
import "../css/font-awesome.min.css"
import "../css/style.css"
import "../css/jquery-ui.min.css"
import "../css/jquery-ui.structure.min.css"
import Listing from "./user/Listing";

class Kayak extends Component {

    handleSubmit = (userdata) => {
    };

    handlePageChange = ((page) => {
        this.props.history.push(page);
    });

    componentWillMount() {
        // this.showLoginOption();
    }

    handleLogout = (() => {
        API.doLogout().then((response) => {
            console.log(response.status);
            if (response.status === 201) {

            }
        });
    });

    showLoginOption = ((item) => {
        console.log(item);
        console.log(this.props.admi);
        API.validateSession().then((response) => {
            if (response.status === 200) {
                let username;
                response.json().then((data) => {
                    username = data.username;
                });
                return (
                    <div>
                        User Email : {this.username}
                    </div>
                )
            }
            // else if(response.status===201){
            //     let username;
            //     response.json().then((data)=>{
            //         username = data.username;
            //     });
            //     return(
            //         <div>
            //             Admin Email : {this.username}
            //         </div>
            //     )
            // }
            else {
                return (
                    <div>
                        <Link to='/login'><span className="glyphicon glyphicon-circle-arrow-right"></span>Login</Link>
                        <Link to='/signup'><span className="glyphicon glyphicon-circle-arrow-right"></span>Sign
                            Up</Link>
                    </div>
                )
            }
        });


    });

    render() {
        return (
            <div>
                <div className="container">
                    <header className="color-1 hovered menu-3">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="nav">
                                        <nav className="menu">
                                            <ul>
                                                <li className="type-1 active">
                                                    <a href="#">home<span className="fa fa-angle-down"></span></a>

                                                </li>
                                                <li className="type-1"><a href="#">Hotels
                                                    <span
                                                        className="fa fa-angle-down"></span></a>

                                                </li>
                                                <li className="type-1"><a href="#">Flights
                                                    <span
                                                        className="fa fa-angle-down"></span></a>

                                                </li>
                                                <li className="type-1"><a href="#">Cars
                                                    <span
                                                        className="fa fa-angle-down"></span></a>

                                                </li>
                                                <li className="type-1"><a href="#">Cruises
                                                    <span
                                                        className="fa fa-angle-down"></span></a>

                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="container">
                    <Switch>
                        <Route exact path="/" render={() => {
                            return(
                               <div>
                                   {this.handlePageChange("/u")}
                               </div>
                            );
                        }}/>

                        <Route path="/payment" render={() =>
                            <UserPaymentPage/>
                        }/>

                        <Route path="/u" render={() =>
                            <UserHome
                                handlePageChange={this.handlePageChange}
                            />
                        }/>

                        <Route path="/listing" render={() =>
                            <Listing/>
                        }/>

                        <Route path="/signup" render={() =>
                            <SignUp
                                handleSubmit={this.handleSubmit}
                                invalidateUserSession={this.invalidateUserSession}/>
                        }/>

                        <Route path="/login" render={() =>
                            <Login
                                handleSubmit={this.handleSubmit}
                                invalidateUserSession={this.invalidateUserSession}
                                handlePageChange={this.handlePageChange}
                            />
                        }/>

                        <Route path="/admin" render={() => (
                            <AdminHome
                                handleLogout={this.handleLogout}
                                handlePageChange={this.handlePageChange}
                            />
                        )}/>

                    </Switch>
                </div>
            </div>
        )
    }
}

export default withRouter(Kayak);

