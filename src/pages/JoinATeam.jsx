import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Utils/supabaseClient"; 
import { Icon } from "../Utils/Icon"; 
import "../css/JoinATeam.css"; 

function JoinATeam() {
    const [subgroupCode, setSubgroupCode] = useState("");
    const [publicSubgroups, setPublicSubgroups] = useState([]);
    const [viewMode, setViewMode] = useState("selection"); // selection, browse
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    
    const navigate = useNavigate();

    // Helper function to handle the database membership insertion
    const saveMembershipToDb = async (subgroupId, subgroupName) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("You must be logged in to join teams.");

        const { error: joinError } = await supabase
            .from("team_members")
            .insert([{ user_id: user.id, subgroup_id: subgroupId }]);

        // Code 23505 is PostgreSQL's error code for a unique constraint violation (already joined)
        if (joinError && joinError.code !== '23505') {
            throw joinError;
        }

        setMessage({ text: `Successfully joined ${subgroupName}!`, type: "success" });
        setTimeout(() => {
            navigate(`/dashboard/gs-south/${subgroupId}`);
        }, 1500);
    };

    // OPTION 1: Fetch and display public sub-teams within GS South
    const handleBrowseSubgroups = async () => {
        setIsLoading(true);
        setMessage({ text: "", type: "" });
        
        try {
            const { data, error } = await supabase
                .from("subgroups")
                .select("*")
                .eq("is_private", false)
                .order("name", { ascending: true });

            if (error) throw error;
            
            setPublicSubgroups(data);
            setViewMode("browse");
        } catch (error) {
            setMessage({ text: error.message || "Failed to load sub-teams.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // OPTION 2: Join custom teams via an access code (e.g., 'WORSH1')
    const handleJoinWithCode = async (e) => {
        e.preventDefault();
        const codeClean = subgroupCode.trim().toUpperCase();
        if (!codeClean) return;

        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { data: subgroup, error } = await supabase
                .from("subgroups")
                .select("id, name")
                .eq("join_code", codeClean)
                .single();

            if (error || !subgroup) {
                throw new Error("Invalid sub-team code. Please check and try again.");
            }

            // 🚀 Call helper to link user to the team in the database
            await saveMembershipToDb(subgroup.id, subgroup.name);

        } catch (error) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    // OPTION 3: Join a public team directly from the browse list button
    const handleJoinPublicTeam = async (subgroupId, subgroupName) => {
        setIsLoading(true);
        setMessage({ text: "", type: "" });

        try {
            // 🚀 Call helper to link user to the team in the database
            await saveMembershipToDb(subgroupId, subgroupName);
        } catch (error) {
            setMessage({ text: error.message, type: "error" });
            setIsLoading(false);
        }
    };

    return (
        <div className="card-panel-centered">
            <div className="main-visual-wrapper">
                <Icon name="locationImage" className="locationIcon" /> 
            </div>

            <h2>GS South Sub-Teams</h2>
            <p>Select an open GS South category below or enter your team access code.</p>

            {/* Status Feedback Messages */}
            {message.text && (
                <div className={`auth-${message.type}-banner`}>
                    {message.text}
                </div>
            )}

            {viewMode === "selection" ? (
                <div className="dual-action-container">
                    <button 
                        type="button" 
                        className="submit browse-btn" 
                        onClick={handleBrowseSubgroups}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Browse Open Teams"}
                    </button>

                    <div className="or-divider">
                        <span className="or-line"></span>
                        <span className="or-text">OR</span>
                        <span className="or-line"></span>
                    </div>

                    <form onSubmit={handleJoinWithCode} className="code-entry-form">
                        <input 
                            type="text" 
                            placeholder="e.g. Enter Code For Worship Team" 
                            value={subgroupCode}
                            onChange={(e) => setSubgroupCode(e.target.value)}
                            required
                            maxLength={6}
                            disabled={isLoading}
                            className="code-input"
                        />
                        <button type="submit" className="submit code-submit-btn" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Join Team Code"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="public-groups-list-container">
                    <button 
                        type="button" 
                        className="toggle-action-btn" 
                        onClick={() => setViewMode("selection")}
                        style={{ marginBottom: "20px" }}
                        disabled={isLoading}
                    >
                        &larr; Back to options
                    </button>
                    
                    {publicSubgroups.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No open public teams found.</p>
                    ) : (
                        <div className="subgroup-list-wrapper">
                            {publicSubgroups.map((sub) => (
                                <div key={sub.id} className="subgroup-item-card">
                                    <div className="subgroup-info">
                                        <strong className="subgroup-title">{sub.name}</strong>
                                        {sub.description && (
                                            <span className="subgroup-desc">{sub.description}</span>
                                        )}
                                    </div>
                                    {/* 🚀 Updated button to explicitly register membership on click */}
                                    <button 
                                        onClick={() => handleJoinPublicTeam(sub.id, sub.name)}
                                        className="toggle-action-btn subgroup-join-link"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Joining..." : "Join Team \u2192"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default JoinATeam;
