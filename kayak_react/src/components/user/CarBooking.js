import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import {connect} from "react-redux"

import {doLogout} from "../../api/user/API_HandleLogout";
import {getCarDetails} from "../../api/user/API_GetDetailsforPayment";
import {getUserDetails} from "../../api/user/API_GetUserDetails";
import {bookCar} from "../../api/user/API_BookCar";
import {insertTravelerDetails} from "../../api/user/API_InsertTravelerDetails";

import Traveler from './Traveler';

import '../../design/css/bootstrap.min.css'
import '../../design/css/jquery-ui.min.css'
import '../../design/css/jquery-ui.structure.min.css'
import '../../design/css/style.css'

class CarBooking extends Component {

    handleSubmit = (userdata) => {

    };

    state = {
        carObject: '',
        userDetails: '',
        paymentDetails: '',
        billingAddress: '',

        carId: this.props.carId,
        fromDate: this.props.carFromDate,
        toDate: this.props.carToDate,

        noofdays: 0,
        base_price: 0
    };

    car_payment = {
        carId: '',
        fromDate: '',
        toDate: '',
        noOfDays: '',
        ticketPrice: '',
        totalAmount: '',
        username: '',
        hostId: ''
    };

    componentWillMount() {
        console.log("1");
        let carId = {
            id: this.state.carId
        };

        getCarDetails(carId)
            .then(res => {
                if (res.status === 200) {

                    console.log(this);
                    console.log("10");

                    res.json()
                        .then(data => {
                            console.log("11");
                            console.log(data);

                            var fromDate = new Date(this.state.fromDate);
                            var toDate = new Date(this.state.toDate);

                            var difference = toDate.getDate() - fromDate.getDate();

                            this.setState({
                                ...this.state,
                                noofdays: difference,
                                carObject: data
                            });

                            console.log("Car base price is " + this.state.carObject.price);
                            // API call to get user details
                            getUserDetails()
                                .then(res => {
                                    if (res.status === 200) {

                                        console.log("start - userDetails");

                                        res.json()
                                            .then(userdata => {
                                                console.log("17");
                                                console.log(userdata);

                                                console.log("18");

                                                this.setState({
                                                    userDetails: userdata.userDetails[0],
                                                    paymentDetails: userdata.paymentDetails[0],
                                                    billingAddress: userdata.billingAddress[0]
                                                });

                                                console.log(this.state);
                                                console.log(this.state.userDetails);
                                                console.log(this.state.paymentDetails);
                                                console.log(this.state.billingAddress);

                                                //Setting all values of flight_payment state
                                                this.car_payment.carId = this.state.carId;
                                                this.car_payment.fromDate = this.state.fromDate;
                                                this.car_payment.toDate = this.state.toDate;
                                                this.car_payment.noOfDays = this.state.noofdays;
                                                this.car_payment.ticketPrice = this.state.carObject.price;
                                                this.car_payment.totalAmount = this.state.carObject.price * this.state.noofdays * 1.09;
                                                this.car_payment.username = this.state.userDetails.username;
                                                this.car_payment.hostId = this.state.carObject.hostId;
                                            });

                                    } else {
                                        console.log("error in getting list");
                                    }
                                });

                            //this.props.hotelList_Success(data);
                        });
                } else {
                    console.log("error in getting list");
                }
            });
    };

    traveler_details = {
        first_name : '',
        last_name : '',
        email : '',
        phonenumber: ''
    };

    billing_address = {
        username : '',
        street1 : '',
        street2 : '',
        postalcode : '',
        city : '',
        state : '',
        country : ''
    };

    payment_details = {
        username : '',
        nameoncard : '',
        creditCardnumber : '',
        validThrough : '',
        cvv : ''
    };

    handleCarBooking(userdata) {
        console.log("In handleFlightBooking");
        console.log(userdata);
        bookCar(userdata)
            .then((res) => {
                console.log(res.status);
                console.log(userdata.username);
                if (res.status === 200) {
                    console.log("success");

                    let payload = {
                        bookingType : "car",
                        userdata : userdata,
                        traveler_details : this.traveler_details,
                        billing_address : this.billing_address,
                        payment_details : this.payment_details
                    };

                    //independent API to insert traveler details, billing address, and payment details
                    insertTravelerDetails(payload)
                        .then((res) => {

                            if (res.status === 200) {
                                console.log("success");
                            }
                            else {
                                console.log("validation");
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                }
                else {
                    console.log("validation");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleSignOut = () => {
        doLogout()
            .then((status) => {
                if (status === 200) {
                    console.log("Logout Successful");
                    this.props.history.push("/");
                }
            });
    };

    render() {
        return (
            <div className="container">
                <header className="color-1 hovered menu-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="nav">
                                    <a href="index.html" className="logo">
                                        <img
                                            src="https://a1.r9cdn.net/rimg/provider-logos/common/socialmedia/kayak-logo.png?width=440&height=220&crop=false"
                                            style={{height: "30%", width: "70%"}}/>
                                    </a>

                                    <div className="nav-menu-icon">
                                        <a href="#"><i></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <nav className="menu">
                                    <ul>

                                        <li className="type-1"><a href="#">Hotels<span
                                            className="fa fa-angle-down"></span></a>
                                        </li>
                                        <li className="type-1"><a href="#">Flights<span
                                            className="fa fa-angle-down"></span></a>
                                        </li>
                                        <li className="type-1"><a href="#">Cars<span
                                            className="fa fa-angle-down"></span></a>
                                        </li>
                                        <li className="type-1"><a href="#">My Account<span
                                            className="fa fa-angle-down"></span></a>
                                            <ul className="dropmenu">
                                                <li><a href="#">Account Preferences {this.props.username} </a></li>
                                                <li><a href="car_block.html">Trips</a></li>
                                                <li><a href="car_detail.html">Watchlist</a></li>
                                                <li><a onClick={this.handleSignOut}>Sign Out</a></li>

                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>

                <br/>

                <hr/>

                <div>
                    <div className="container">
                        <div className="row list-wrapper  bg-grey-2">
                            <div className="col-md-8">
                                <div className="list-content clearfix">
                                    <div className="list-item-entry">
                                        <div className="hotel-item style-10 bg-white">
                                            <div className="table-view">

                                                <div className="title hotel-middle cell-view">
                                                    <h5 className="color-grey-3">You are booking car with ID</h5>
                                                    <h5><strong
                                                        className="color-red-3">{this.state.carId}</strong>
                                                    </h5>

                                                    <br/><br/>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="list-content clearfix">
                                    <div className="list-item-entry">
                                        <div className="bg-grey-2">
                                            <div className="table-view">
                                                <div className="title hotel-middle cell-view">
                                                    <div className="col-sm-12">

                                                        <h4><strong className="color-red-3">FARE DETAILS</strong></h4>
                                                        <br/>


                                                        <div className="col-sm-2">
                                                            <h6>No. of Days</h6>
                                                        </div>


                                                        <div className="col-sm-2">
                                                            <h6>Base</h6>
                                                        </div>

                                                        <div className="col-sm-2">
                                                            <h6>Taxes & Fees</h6>
                                                        </div>

                                                        <div className="col-sm-4">
                                                            <h6>Per Day</h6>
                                                        </div>

                                                        <div className="2">
                                                            <h6>Total</h6>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">

                                                        <div className="col-sm-2">
                                                            <h4><span
                                                                className="color-red-3">{this.state.noofdays}</span>
                                                            </h4>
                                                        </div>

                                                        <div className="col-sm-2">
                                                            <h4><span
                                                                className="color-red-3">{this.state.carObject.price}</span>
                                                            </h4>
                                                        </div>

                                                        <div className="col-sm-2">
                                                            <h4><span
                                                                className="color-red-3">{(this.state.carObject.price * 0.09).toFixed(2)}</span>
                                                            </h4>
                                                        </div>

                                                        <div className="col-sm-4">
                                                            <h4><span
                                                                className="color-red-3">{(this.state.carObject.price * 1.09).toFixed(2)}</span>
                                                            </h4>
                                                        </div>

                                                        <div className="col-sm-2">
                                                            <h4><span
                                                                className="color-red-3">{(this.state.carObject.price * this.state.noofdays * 1.09).toFixed(2)}</span>
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <hr/>

                                                        <h5><strong className="color-red-3">Enter Renter Information</strong>
                                                        </h5>
                                                        <br/>

                                                        <div className="col-sm-6">
                                                            <h6>First Name</h6>
                                                            <input type="text"
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                   onChange={
                                                                       (event) => {
                                                                           this.traveler_details.first_name = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <h6>Lastname</h6>
                                                            <input type="text"
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                   onChange={
                                                                       (event) => {
                                                                           this.traveler_details.last_name = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <div className="col-sm-6">
                                                            <h6>Email Address</h6>
                                                            <input type="text"
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                   onChange={
                                                                       (event) => {
                                                                           this.traveler_details.email = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <h6>Phone Number</h6>
                                                            <input type="text"
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                   onChange={
                                                                       (event) => {
                                                                           this.traveler_details.phonenumber = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <hr/>
                                                        <h5><strong className="color-red-3">Enter Billing
                                                            Information</strong></h5>
                                                        <h6>
                                                            <small>Billing Address</small>
                                                        </h6>
                                                        <br/>

                                                        <div className="col-sm-6">
                                                            <h6>Street
                                                                <small>Line 1</small>
                                                            </h6>
                                                            <input type="text" name=""
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.street1}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.street1 = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <h6>Street
                                                                <small>Line 2</small>
                                                            </h6>
                                                            <input type="text" name=""
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.street2}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.street2 = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-12">
                                                        <div className="col-sm-6">
                                                            <h6>Postal Code</h6>
                                                            <input type="text" name="" className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.postalcode}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.postalcode = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <h6>City</h6>
                                                            <input type="text" name="" className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.city}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.city = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <div className="col-sm-6">
                                                            <h6>State/Region</h6>
                                                            <input type="text" name="" className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.state}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.state = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <h6>Country</h6>
                                                            <input type="text" name="" className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.billingAddress.country}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.billing_address.country = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12">
                                                        <hr/>
                                                        <h5><strong className="color-red-3">Card Details</strong></h5>
                                                        <br/>

                                                        <div className="col-sm-6">
                                                            <h6>Name on Card</h6>
                                                            <input type="text" name=""
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.paymentDetails.nameoncard}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.payment_details.nameoncard = event.target.value
                                                                       }
                                                                   }

                                                            />
                                                        </div>

                                                        <div className="col-sm-6">
                                                            <h6>Card Number</h6>
                                                            <input type="text" name=""
                                                                   className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.paymentDetails.creditCardNumber}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.payment_details.creditCardnumber = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-8">
                                                        <div className="col-sm-6">
                                                            <h6>Valid Through</h6>
                                                            <input type="date" name="" className="form-control input-sm"
                                                                   id="validThrough"
                                                                // placeholder={this.state.paymentDetails.validThrough}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.payment_details.validThrough = event.target.value
                                                                       }
                                                                   }
                                                            />

                                                        </div>
                                                        <div className="col-sm-2">
                                                            <h6>CVV</h6>
                                                            <input type="" name="" className="form-control input-sm"
                                                                   id=""
                                                                // placeholder={this.state.paymentDetails.cvv}
                                                                   onChange={
                                                                       (event) => {
                                                                           this.payment_details.cvv = event.target.value
                                                                       }
                                                                   }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <hr/>
                                                        <h5><strong className="color-red-3">Rental Insurance </strong>
                                                            <small>(optional)</small>
                                                        </h5>
                                                        <h6>
                                                            <small>It Saves You Money! Purchasing collision damage insurance online is almost always cheaper than at the counter.</small>
                                                        </h6>

                                                        <div className="radio">
                                                            <h6>
                                                            <label><input type="radio" name="optradio"/>
                                                                <strong>Yes, </strong>
                                                                <small>
                                                                    <br/>1. Covers costs if your rental car is stolen or is damaged in an accident or while left unattended
                                                                    <br/>2. Provided as primary coverage – no deductible
                                                                    <br/>3. Toll-free, 24-hour emergency hotline help included
                                                                </small>
                                                            </label>
                                                            </h6>
                                                        </div>
                                                        <div className="radio">
                                                            <h6>
                                                            <label><input type="radio" name="optradio"/>
                                                                <strong>No, </strong>
                                                                <small>"Nothing goes wrong when I travel." – Familiar with Murphy's Law? There's a first time for everything.
                                                                    Recommended by AGA Service Company, the licensed producer and administrator of this plan. Insurance benefits are underwritten by either BCS Insurance Company or Jefferson Insurance Company, depending on insured's state of residence. Terms, conditions and exclusions apply.
                                                                </small>
                                                            </label>
                                                            </h6>
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-12">
                                                        <hr/>
                                                        <h5><strong className="color-red-3">Terms & Conditions</strong>
                                                            <small></small>
                                                        </h5>
                                                        <br/>

                                                        <h6>Cancellation Policy</h6>
                                                        <h6>
                                                            <small>
                                                                <br/>1. E-Z Rent-A-Car will charge your credit card the amount shown below at the time of booking. See detailed rental terms for cancellation and change policy information for this rental.
                                                                <br/>2. You will need a credit card to pick up this car.
                                                            </small>
                                                        </h6>

                                                        <br/>

                                                        <h5>By clicking <strong>"Book"</strong> you agree to KAYAK's
                                                            policies</h5>

                                                        <div className="checkbox">
                                                            <h6>
                                                                <label><input type="checkbox"/><strong>Email me KAYAK's
                                                                    deals</strong></label>
                                                            </h6>
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-12">
                                                        <button
                                                            className="btn-block btn-success btn-group-sm"
                                                            type="button"
                                                            onClick={() => this.handleCarBooking(this.car_payment)}>
                                                            BOOK
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="list-content clearfix">
                                    <div className="list-item-entry">
                                        <div className="hotel-item style-10 bg-white">
                                            <div className="table-view">

                                                <div className="title hotel-middle cell-view">
                                                    <h4 className="">Summary</h4>
                                                    <hr/>
                                                    <h6><strong className="">Etihad Airways - One Way - Economy - Adults
                                                        : 3</strong></h6>
                                                    <h6>Depart Wed 11/22: SFO > LHR 1:35p – 3:55p <br/>Flight 669 Flight
                                                        7</h6>
                                                    <h6>Return Thu 11/23: LHR > SFO 10:30p – 12:05p <br/> Flight 8
                                                        Flight 668</h6>

                                                    <br/><br/>
                                                    <h4>Costing</h4>
                                                    <hr/>
                                                    <h6>1 Adult, Economy</h6>
                                                    <h6>Taxes, Fees and Surcharges</h6>

                                                    <hr/>
                                                    <h5><strong>TOTAL</strong></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

//if you need anything from state to use here
function mapStateToProps(state) {

    return {
        carId: state.carId,
        carFromDate: state.carFromDate,
        carToDate: state.carToDate
    };
}

//if you need to push something to state, use action -> reducer
function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CarBooking));