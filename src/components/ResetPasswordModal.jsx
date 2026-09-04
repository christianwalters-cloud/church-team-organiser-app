import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../Utils/supabaseClient";

function ResetPasswordModal() {
  const { showResetModal, setShowResetModal } = useAuth();
  
  // Local state handling the entry fields inside the popup card loop
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Return null immediately if the global context switch is turned off
  if (!showResetModal) return null;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (newPassword !== confirmNewPassword) {
      setModalError("Passwords do not match!");
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setModalSuccess("Password successfully updated! Closing window...");
      setNewPassword("");
      setConfirmNewPassword("");
      
      // Automatically dismiss the popup after 2 seconds on execution success
      setTimeout(() => {
        setShowResetModal(false);
        setModalSuccess("");
      }, 2000);

    } catch (err) {
      setModalError(err.message || "Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Reset Your Password</h3>
        <p>Please enter your new password configuration below.</p>

        <form onSubmit={handleUpdatePassword} className="modal-form">
          {modalError && <div className="auth-error-banner">{modalError}</div>}
          {modalSuccess && <div className="auth-success-banner">{modalSuccess}</div>}

          <div className="input-group">
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Password"}
            </button>
            <button 
              type="button" 
              className="modal-cancel-btn" 
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
