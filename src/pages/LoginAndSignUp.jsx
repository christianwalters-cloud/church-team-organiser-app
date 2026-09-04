import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput"; 
import "../css/LoginAndSignUp.css";
import { supabase } from "../Utils/supabaseClient";

function LoginAndSignUp() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (action === "Sign Up" && password !== confirmPassword) {
        setErrorMsg("Passwords do not match!");
        setIsLoading(false);
        return;
    }

    try {
      if (action === "Login") {
        const { error } = await login(email, password);
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await signUp(email, password, {
          data: { display_name: name }
        });
        if (error) throw error;

        setSuccessMsg("Account successfully created! Please log in.");
        setAction("Login");
        setName("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setErrorMsg(err.message || "An authentication error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
        setErrorMsg("Please enter your email address first so we can send a password reset link.");
        return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/`,
        });
        if (error) throw error;
        setSuccessMsg("Password reset link sent to your email!");
    } catch (err) {
        setErrorMsg(err.message || "Could not process password reset request.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className="text">{action}</div>
        <div className='underline'></div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}
        {successMsg && <div className="auth-success-banner">{successMsg}</div>}

        <div className='inputs'>
          {/* 2. REPLACED LAYOUTS WITH CLEAN REUSABLE COMPONENT TAGS */}
          {action !== "Login" && (
            <FormInput 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              iconName="loginImage" 
            />
          )}

          <FormInput 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            iconName="chatsImage" 
          />

          <FormInput 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            iconName="lockImage"
          >
            {/* Embedded custom action button passed directly via children slot */}
            <button 
              type="button" 
              className="password-reveal-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </FormInput>

          {action === "Sign Up" && (
            <FormInput 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              iconName="lockImage" 
            />
          )}
        </div>

        {action === "Login" && (
          <div className="forgot-password">
            Lost Password? <span onClick={handleForgotPassword}>Click here</span>
          </div>
        )}

        <div className="submit-container">
          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : `Confirm ${action}`}
          </button>
          
          <div className="toggle-action-row">
            <span>{action === "Sign Up" ? "Already have an account? " : "Need a new account? "}</span>
            <button 
              type="button" 
              className="toggle-action-btn"
              onClick={() => setAction(action === "Sign Up" ? "Login" : "Sign Up")}
            >
              {action === "Sign Up" ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginAndSignUp;
