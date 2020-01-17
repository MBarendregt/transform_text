import React from 'react';
import '../static/folder.css'

async function postData(url = '', data = {}) {
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authorizationToken": process.env.MY_VAR

            },
            body: JSON.stringify(data)
        });
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
            additionalmessage: '',
            data: ''
        };

        this.baseState = this.state
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });

    }

    handleSubmit(event) {
        event.preventDefault();
        let data = {
            "description": this.state.description
        };
        postData('https://onuif9iroi.execute-api.eu-west-1.amazonaws.com/prod/transform', data)
            .then(data => {
                this.setState(this.baseState)
                this.setState({ additionalmessage: 'Converted the following message:' })
                this.setState({ submitmessage: convertUnicode(data.replace(/['"]+/g, '')) })
                setTimeout(() => {
                    this.setState({ additionalmessage: '' })
                    this.setState({ submitmessage: '' });
                }, 5000);

            });

    }
    render() {
        return (
            <form className="signup-form" onSubmit={this.handleSubmit}>
                <div className="formcontainer">
                    <div>
                        <label>Insert string below</label>
                        <br></br>
                        <br></br>
                        <span>See what happens when you fill in some text that contains Amazon, Oracle, Microsoft, Google or Deloitte.</span>
                        <br></br>
                        <br></br>
                        <span>It should be Upper or Lower case agnostic.</span>
                    </div>
                    <div className="form__moreinfo-textarea">
                        <textarea
                            className="from__textarea"
                            name="description"
                            onChange={this.handleChange}
                            value={this.state.description}
                            required />
                    </div>
                    <div className="form__submit">
                        <input type="submit" value="Submit" className="send-form" />
                    </div>
                    <div>
                        <span>
                            {this.state.additionalmessage} <br></br>
                            {this.state.submitmessage}
                        </span>
                    </div>
                </div>

            </form >
        );
    }
}


export default Transform