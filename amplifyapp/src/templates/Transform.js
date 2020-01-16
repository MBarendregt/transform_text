import React from 'react';
// import validator from 'validator';
import '../static/folder.css'

// function validate(firstname) {
//     return {
//         firstname: validateNames(firstname)
//     };
// }

// function validateNames(name) {
//     if (validator.isAlpha(name)) {
//         return false
//     } else {
//         return true
//     }
// }
async function postData(url = '', data = {}) {
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

    console.log(response)
    return await response.text();
}

function convertUnicode(input) {
    return input.replace(/\\u(\w\w\w\w)/g, function (a, b) {
        var charcode = parseInt(b, 16);
        return String.fromCharCode(charcode);
    });
}

class Transform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            submitmessage: '',
            errorclass: false,
            touched: {
                description: '',
                lastname: '',
                email: '',
                tel: ''
            },
            data: ''
        };

        this.baseState = this.state
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });

    }



    handleSubmit(event) {
        event.preventDefault();
        console.log("fn: " + this.state.description);

        let data = {
            "description": this.state.description
        };
        postData('https://cors-anywhere.herokuapp.com/https://onuif9iroi.execute-api.eu-west-1.amazonaws.com/prod/transform', data)
            .then(data => {
                // let copy = { '\u00A9' };
                var data = data.replace(/['"]+/g, '')
                var data = convertUnicode(data)
                console.log(data)
                this.setState({ submitmessage: data })
            });
        //     .then(data) => {
        //     console.log("wtf:" + data);
        // };
        // method for doing something with the returned data
        // .then((data) => {
        //     console.log("wtf:" + data)
        // })
        //     this.setState(this.baseState)
        //     this.setState({ errorclass: true })
        //     let firstname = this.state.firstname

        //     this.setState({
        //         submitmessage: 'Bedankt ' + firstname.charAt(0).toUpperCase() +
        //             firstname.slice(1) + ' voor uw aanmelding!'
        //     });
        //     setTimeout(() => {
        //         this.setState({ submitmessage: '' });
        //     }, 5000);
        // }
    }


    render() {
        // const errors = validate(this.state.firstname);
        // const shouldMarkError = (field) => {
        //     const hasError = errors[field];
        //     const shouldShow = this.state.touched[field];
        //     return hasError ? shouldShow : false;
        // };
        return (
            <form className="signup-form" onSubmit={this.handleSubmit}>
                <div className="formcontainer">
                    <div>
                        <label>Insert String below</label>
                    </div>
                    <div className="form__moreinfo-textarea">
                        <textarea
                            className="from__textarea"
                            name="description"
                            onChange={this.handleChange}
                            value={this.state.description} />
                    </div>
                    {/* <span className={shouldMarkError('firstname') ? "errorshow" : "errorhide"}>Dit veld is verplicht en mag geen cijfers of vreemde tekens bevatten</span> */}
                    <div className="form__submit">
                        <input type="submit" value="Submit" className="send-form" /> <span className={this.state.errorclass ? "form__submitmessage" : "form__submitmessageinc"}>{this.state.submitmessage}</span>
                    </div>
                    <div>
                        <span>
                            {console.log(typeof this.state.submitmessage)}
                            {this.state.submitmessage}
                        </span>
                    </div>
                </div>

            </form >
        );
    }
}


export default Transform