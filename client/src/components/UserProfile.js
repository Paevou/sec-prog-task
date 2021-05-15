import React, { useEffect, useState } from 'react';
function UserProfile(user) {

//   const [firstName, setFirstName] = useState(user.firstName);
//   const [lastName, setLastName] = useState(user.lastName);
//   const [email, setEmail] = useState(user.email);

//   const [password, setPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [values, setValues] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [errors, setErrors] = useState(user);

  const handleSubmit = (e) => {
      console.log("Submit");
      e.preventDefault();
      setErrors(validate());
      if(Object.keys(errors).length === 0) {
        console.log("Values: ", values)    
        
        fetch('/user/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        });
      }
  }

  const handleChange = (e) => {
    e.persist();
    setValues(values => ({...values, [e.target.name]: e.target.value}));
  }

  const validate = () => {
    let errors = {};

    if(!values.firstName) {
        errors.firstName = "First name can't be empty.";
    }

    if(!values.lastName) {
        errors.lastName = "Last name can't be empty.";
    }

    if(!values.password) {
        errors.password = 'Password can\'t be empty.';
    }

    if(values.newPassword) {
        if(!values.newPasswordConfirm) {
            errors.newPasswordConfirm = 'Password confirmation can\'t be empty.';
        } else if(values.newPasswordConfirm !== values.newPassword) {
            errors.newPasswordConfirm = 'New passwords don\'t match';
        }
    }
    console.log("Errors: ", errors)
    return errors;
  }

  useEffect(() => {
      fetch("/user")
        .then(res => res.json())
        .then((result) => {
            setValues(result);
            setIsLoaded(true);
      }, (error) => {
          setErrors(error);
          setIsLoaded(true);
      });
  }, []);
  if (!isLoaded) {
      return (<div> Loading...</div>);
  }
  else {
    return (
        <div className="container">
          <form onSubmit={e => handleSubmit(e)}>
              <div className="row">
                <div className="form-group col-md-6">
                    <label>First Name:</label>
                    <input 
                        className="form-control"
                        defaultValue={values.firstName} 
                        onChange={(e) => {handleChange(e)}}
                        name="firstName"    
                    />   
                </div>  
                <div className="text-danger">{errors.firstName}</div> 
                <div className="form-group col-md-6">       
                    <label>Last Name:</label>
                    <input 
                        className="form-control"
                        defaultValue={values.lastName} 
                        onChange={handleChange} 
                        name="lastName"   
                    />  
                </div>   
                <div className="text-danger">{errors.lastName}</div>      
            </div> 
            <div className="row"> 
                <div className="form-group col-md-12">        
                    <label>Email: `{values.email}`</label>
                    {/* <input
                        className="form-control"
                        defaultValue={user.email} 
                        onChange={handleChange} 
                        name="email"   
                    /> */}
                </div>    
                <div className="text-danger">{errors.email}</div>  
            </div>
            <div className="row"> 
                <div className="form-group col-md-6">  
                    <label>Password</label>
                    <input     
                        type="password"        
                        className="form-control"
                        placeholder="*******" 
                        onChange={handleChange}
                        name="password"   
                    />
                </div> 
                <div className="text-danger">{errors.password}</div> 
            </div> 
            <div className="row"> 
                <div className="form-group col-md-6">
                    <label>New Password</label>
                    <input 
                        type="password"
                        className="form-control"
                        placeholder="*******" 
                        onChange={handleChange}
                        name="newPassword"   
                    />
                </div> 
                <div className="text-danger">{errors.newPassword}</div>   
                <div className="form-group col-md-6">    
                    <label>New Password Confirmation</label>
                    <input 
                        type="password"
                        className="form-control"
                        placeholder="*******" 
                        onChange={handleChange}
                        name="newPasswordConfirm"   
                    />
                </div>
                <div className="text-danger">{errors.newPasswordConfirm}</div> 
            </div>
            <button type="submit" value="Submit"  className="btn btn-danger">Save changes</button> 
          </form> 
        </div>     
      );
  }
  
}

export default UserProfile;