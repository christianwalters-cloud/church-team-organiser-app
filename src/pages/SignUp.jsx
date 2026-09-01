function SignUp(){
    return(
        <div className="login-container">
            <p>email</p>
            <input type="text" placeholder="type in your email"/>
            <p>password</p>
            <input type="text" placeholder="type in your password"/>
            <p>conformation password</p>
            <input type="text" placeholder="type in your password"/>
            <button type="button">SignUp</button>

        </div>
    )
}
export default SignUp;