import React, {Component} from 'react';
import { Route, withRouter, Switch, Link } from 'react-router-dom';
import AdminHome from "./admin/AdminHome";
import UserPaymentPage from "./user/UserPaymentPage";

import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./user/Home";

import '../design/css/home.css'

import * as API from "../api/API";

class Kayak extends Component {


    handleSubmit = (userdata) => {
    };

    handlePageChange = ((page)=>{
        this.props.history.push(page);
    });

    componentWillMount(){
        // this.showLoginOption();
    }

    handleLogout = (()=>{
       API.doLogout().then((response)=>{
          console.log(response.status);
          if(response.status===201){

          }
       });
    });

    showLoginOption = ((item)=>{
        console.log(item);
        console.log(this.props.admi);
        API.validateSession().then((response)=>{
            if(response.status===200){
                let username;
                response.json().then((data)=>{
                    username = data.username;
                });
                return(
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
                return(
                    <div>
                        <Link to='/login'><span className="glyphicon glyphicon-circle-arrow-right"></span>Login</Link>
                        <Link to='/signup'><span className="glyphicon glyphicon-circle-arrow-right"></span>Sign Up</Link>
                    </div>
                )
            }
        });


    });

    render() {
        return (
            <div>
                <div className="container-fluid">

                    {/*<hr/>*/}
                    {/*{this.showLoginOption(this.state)}*/}
                    {/*<hr/>*/}

                    {/*<Link to='/admin'><span className="glyphicon glyphicon-circle-arrow-right"></span>Admin</Link>*/}

                    <Switch>
                        <Route exact path="/" render={() =>
                            <Home/>
                        }/>

                        <Route path="/u" render={() =>
                            <UserPaymentPage/>
                        }/>

                        <Route path="/signup" render={() =>
                            <SignUp
                                handleSubmit={this.handleSubmit}
                                invalidateUserSession={this.invalidateUserSession}/>
                        }/>

                        <Route path="/login" render={() =>
                            <Login
                                handleSubmit={this.handleSubmit}
                                invalidateUserSession = {this.invalidateUserSession}
                                handlePageChange = {this.handlePageChange}
                            />
                        }/>

                        <Route path="/admin" render={() => (
                            <AdminHome
                                handleLogout = {this.handleLogout}
                            />
                        )}/>

                    </Switch>
                </div>
            </div>
        )
    }
}

export default withRouter(Kayak);

