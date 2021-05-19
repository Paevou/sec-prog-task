import React from 'react'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            input: {},
            errors: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /**
     * Handles changes in the user form
     * @param {*} event 
     */
    handleChange(event) {
        let input = this.state.input;
        input[event.target.name] = event.target.value;
        this.setState({input});
    }

    /**
     * Handles the form submit
     * @param {*} event 
     */
    handleSubmit(event) {
        event.preventDefault();
        if(this.validate()) {
                        
            let data = new FormData();
            const payload = {
                email: this.state.input.email,
                password: this.state.input.password

            }
            data.append("user", typeof payload)
            fetch('/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state.input)
            })
            .then(result => {
                if(result.redirected !== true) {
                    this.props.login();
                }
            });

            let input = {};
            input['email'] = "";
            input['password'] = "";
            this.setState({input:input});
        }
    }

    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if(!input['email']) {
            isValid = false;
            errors['email'] = 'Please enter your email address.';
        }

        if(!input['password']) {
            isValid = false;
            errors['password'] = 'Please enter your password.';
        }

        this.setState({errors:errors});
        return isValid;
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-7 mrgnbtm">
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="text" onChange={this.handleChange} value={this.state.input.email}  className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                            </div>
                            <div className="text-danger">{this.state.errors.email}</div>
                            <div className="form-group col-md-6">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" onChange={this.handleChange} value={this.state.input.password} className="form-control" name="password" id="password" placeholder="Password" />
                            </div>
                            <div className="text-danger">{this.state.errors.password}</div>
                        </div>
                        
                        <button type="submit" value="Submit"  className="btn btn-danger">Login</button>
                    </form>
                    </div>
                </div>
            </div>
        )
    }    
}

export default Login;
