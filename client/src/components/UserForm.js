import React from 'react'

class UserForm extends React.Component {
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
        if( event.target.name == 'password' || event.target.name == 'password_confirm')
            this.validatePassword();
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
                firstname: this.state.input.firstname,
                lastname: this.state.input.lastname,
                email: this.state.input.email,
                password: this.state.input.password,
                password_confirm: this.state.input.password_confirm

            }
            data.append("user", typeof payload)
            fetch('/user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state.input)
            });

            let input = {};
            input['firstname'] = "";
            input['lastname'] = "";
            input['email'] = "";
            input['password'] = "";
            input['password_confirm'] = "";
            this.setState({input:input});
        }
    }
    /**
     * Validates the form fields
     */
    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if(!input['firstname']) {
            isValid = false;
            errors['firstname'] = 'Please enter your first name.';
        }

        if(!input['lastname']) {
            isValid = false;
            errors['lastname'] = 'Please enter your last name.';
        }

        if(!input['email']) {
            isValid = false;
            errors['email'] = 'Please enter your email address.';
        }

        if(!input['password']) {
            isValid = false;
            errors['password'] = 'Please enter your password.';
        }

        if(!input['password_confirm']) {
            isValid = false;
            errors['password_confirm'] = 'Please confirm your password.';
        }
        // Validate passwords to be the same
        if(typeof input['password'] !== 'undefined' && typeof input['password_confirm'] !== 'undefined') {
           if(input['password'] !== input['password_confirm']) {
                isValid = false;
                errors['password_confirm'] = "Password doesn't match with the confirmation.";
            } 
        }
        this.setState({errors:errors});
        return isValid;
    }

    validatePassword() {
        let input = this.state.input;        
        let errors = {};
        let isValid = true;

        if(typeof input['password'] !== 'undefined' && typeof input['password_confirm'] !== 'undefined') {
            if(input['password'] !== input['password_confirm']) {
                 isValid = false;
                 errors['password_confirm'] = "Password doesn't match with the confirmation.";
             } 
         }
         
        this.setState({errors:errors});
        return isValid;
    }
    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-7 mrgnbtm">
                    <h2>Create User</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="exampleInputEmail1">First Name</label>
                                <input type="text" onChange={this.handleChange} value={this.state.input.firstname}  className="form-control" name="firstname" id="firstname" aria-describedby="emailHelp" placeholder="First Name" />
                            </div>
                            <div className="text-danger">{this.state.errors.firstname}</div>
                            <div className="form-group col-md-6">
                                <label htmlFor="exampleInputPassword1">Last Name</label>
                                <input type="text" onChange={this.handleChange} value={this.state.input.lastname} className="form-control" name="lastname" id="lastname" placeholder="Last Name" />
                            </div>
                            <div className="text-danger">{this.state.errors.lastname}</div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="text" onChange={this.handleChange} value={this.state.input.email} className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                            </div>
                            <div className="text-danger">{this.state.errors.email}</div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" onChange={this.handleChange} value={this.state.input.password} className="form-control" name="password" id="password" aria-describedby="passwordHelp" placeholder="Password" />
                            </div>
                            <div className="text-danger">{this.state.errors.password}</div>
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputPassword1">Password confirmation</label>
                                <input type="password" onChange={this.handleChange} value={this.state.input.password_confirm} className="form-control" name="password_confirm" id="password_confirm" aria-describedby="passwordHelp" placeholder="Password" />
                            </div>
                            <div className="text-danger">{this.state.errors.password_confirm}</div>
                        </div>
                        <button type="submit" value="Submit"  className="btn btn-danger">Create</button>
                    </form>
                    </div>
                </div>
            </div>
        )
    }    
}

export default UserForm;
