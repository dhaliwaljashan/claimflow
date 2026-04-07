import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RESOLUTION_STATUS_OPTIONS } from "../utils/claimOptions";
import api from "../api/axios";

function ClaimDetailsPage() {
    const { id } = useParams(); // get claim ID from URL
    const navigate = useNavigate();
    const {user} = useAuth();

    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [deleting, setDeleting] = useState(false);

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const [auditLogs, setAuditLogs] = useState([]);

    const [newError, setNewError] = useState({
        errorCode: "",
        errorType: "",
        description: "",
        resolutionStatus: "Open"
    });

    const fetchClaimDetails = async () => {
        try {
            const [claimResponse, errorsResponse, notesResponse, auditLogsResponse] = await Promise.all([
                api.get(`/claims/${id}`),
                api.get(`/claimerrors/by-claim/${id}`),
                api.get(`/claimnotes/by-claim/${id}`),
                api.get(`/auditlogs/by-claim/${id}`)
            ]);
            
            setClaim(claimResponse.data);
            setErrors(errorsResponse.data);
            setNotes(notesResponse.data);
            setAuditLogs(auditLogsResponse.data);
        } catch (err) {
            setErrorMessage("Failed to fetch claim details.");
        } finally {
            setLoading(false);
        }
    };  

    useEffect(() => {
        fetchClaimDetails();
    }, [id]);

    const handleErrorInputChange = (e) => {
        const { name, value } = e.target;
        setNewError((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handleAddError = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!newError.errorCode || !newError.errorType || !newError.description) {
        setErrorMessage("Please fill in all error fields.");
        return;
        }   

        try {
        await api.post("/claimerrors", {
            claimId: Number(id),
            errorCode: newError.errorCode,
            errorType: newError.errorType,
            description: newError.description,
            resolutionStatus: newError.resolutionStatus
            });

            setNewError({
                errorCode: "",
                errorType: "",
                description: "",
                resolutionStatus: "Open"
            });

            fetchClaimDetails(); // refresh claim details to show new error
        } catch (err) {
        console.error("Error adding claim error:", err);
        setErrorMessage(err.response?.data?.message || "Failed to add error. Please try again.");
        }
    };

    const handleResolutionChange = async (claimErrorId, resolutionStatus) => {
        try {
            await api.put(`/claimerrors/${claimErrorId}/resolution-status`, {
                resolutionStatus
            });

            fetchClaimDetails(); // refresh to show updated status
        } catch (err) {
            console.error("Error updating resolution status:", err);
            setErrorMessage("Failed to update resolution status. Please try again.");
        }
    };

    const handleDeleteClaim = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this claim? This action cannot be undone."
        );

        if(!confirmed) {
            return;
        }

        setErrorMessage("");
        setDeleting(true);

        try{
            await api.delete(`/claims/${id}`);
            navigate("/claims");
        } catch (err) {
            setErrorMessage(
                err.response?.data?.message || "Failed to delete claim."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if(!newNote.trim()) {
            setErrorMessage("Note text is required,");
            return;
        }

        try {
            await api.post("/claimnotes", {
                claimId:Number(id),
                userId:user?.userId,
                noteText:newNote
            });

            setNewNote("");
            fetchClaimDetails();
        } catch(err) {
            setErrorMessage(err.response?.data?.message || "Failed to add note.");
        }
    };

    if (loading) {
        return <p style={{ padding: "20px" }}>Loading claim details...</p>;
    }

    if (errorMessage && !claim) {
        return <p style={{ padding: "20px", color: "red" }}>{errorMessage}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Claim Details</h2>
            {claim && (
                <div style={sectionBox}>
                    <p><strong>Claim ID:</strong> {claim.claimId}</p>
                    <p><strong>Member ID:</strong> {claim.memberId}</p>
                    <p><strong>Provider ID:</strong> {claim.providerId}</p>
                    <p><strong>State:</strong> {claim.state}</p>
                    <p><strong>Claim Type:</strong> {claim.claimType}</p>
                    <p><strong>Amount:</strong> ${Number(claim.amount).toFixed(2)}</p>
                    <p><strong>Status:</strong> {claim.status}</p>
                    <p><strong>Internal:</strong> {claim.isInternal ? "Yes" : "No"}</p>

                    <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                        <Link to ={`/claims/edit/${claim.claimId}`} style={linkButtonStyle}>
                        Edit Claim
                        </Link>

                        {user?.role === "Admin" && (
                            <button
                                onClick={handleDeleteClaim}
                                disabled={deleting}
                                style={deleteButtonStyle}
                            >
                                {deleting ? "Deleting..." : "Delete Claim"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div style={sectionBox}>
                <h3>Add Claim Error</h3>

                <form onSubmit={handleAddError}>
                    <div style={rowStyle}>
                        <input
                            type="text"
                            name="errorCode"
                            placeholder="Error Code"
                            value={newError.errorCode}
                            onChange={handleErrorInputChange}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            name="errorType"
                            placeholder="Error Type"
                            value={newError.errorType}
                            onChange={handleErrorInputChange}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{marginBottom: "15px"}}>
                        <textarea
                            name="description"
                            placeholder="Error Description"
                            value={newError.description}
                            onChange={handleErrorInputChange}
                            style={{...inputStyle, minHeight: "90px", width: "100%"}}  
                        />
                    </div>

                    <div style={{marginBottom: "15px"}}>
                        <select
                            name="resolutionStatus"
                            value={newError.resolutionStatus}
                            onChange={handleErrorInputChange}
                            style={{...inputStyle, width: "100%"}}
                        >
                            {RESOLUTION_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" style={{buttonStyle}}>
                        Add Error
                    </button>
                </form>

                {errorMessage && (
                    <p style={{ color: "red", marginTop: "15px" }}>{errorMessage}</p>
                )}  
            </div>

            <div style={sectionBox}>
                <h3>Claim Errors</h3>
                {errors.length === 0 ? (
                    <p>No errors found for this claim.</p>
                ) : (
                    <table style={{tableStyle}}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Error Code</th>   
                                <th style={thStyle}>Error Type</th>
                                <th style={thStyle}>Description</th>
                                <th style={thStyle}>Resolution Status</th>
                                <th style={thStyle}>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errors.map((item) => (
                                <tr key={item.claimErrorId}>
                                    <td style={tdStyle}>{item.errorCode}</td>
                                    <td style={tdStyle}>{item.errorType}</td>
                                    <td style={tdStyle}>{item.description}</td>
                                    <td style={tdStyle}>{item.resolutionStatus}</td>
                                    <td style={tdStyle}>
                                        <select
                                            value={item.resolutionStatus}
                                            onChange={(e) => handleResolutionChange(item.claimErrorId, e.target.value)}
                                            style={{padding: "8px"}}
                                        >
                                            {RESOLUTION_STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>

            <div style={sectionBox}>
                <h3>Claim Notes</h3>

                <form onSubmit={handleAddNote} style={{marginBottom: "20px"}}>
                    <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note for this claim"
                    style={{ ...inputStyle, width: "100%", minHeight: "100px" }}
                    />
                    
                    <div style={{marginTop: "12px"}}>
                        <button type="submit" style={{buttonStyle}}>
                            Add note
                        </button>
                    </div>
                </form>

                {notes.length === 0 ? (
                    <p>No notes added yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {notes.map((note) => (
                            <div key={note.claimNoteId} style={noteCardStyle}>
                                <p style={{ margin: 0, marginBottom: "8px" }}>{note.noteText}</p>
                                <small style={{ color: "#6b7280" }}>
                                    {note.userName} • {new Date(note.createdAt).toLocaleString()}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={sectionBox}>
                <h3>Audit History</h3>
                {auditLogs.length === 0 ? (
                    <p>No audit history found.</p>
                    ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {auditLogs.map((log) => (
                            <div key={log.auditLogId} style={noteCardStyle}>
                                <p style={{ margin: 0, marginBottom: "8px" }}>{log.description}</p>
                                <small style={{ color: "#6b7280" }}>
                                    {log.userName} • {log.actionType} • {new Date(log.timestamp).toLocaleString()}
                                </small>
                            </div>
                        ))}
                    </div>                        
                )}
            </div>
        </div>
    );
}

const sectionBox = {
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "20px"
};

const rowStyle = {
    display: "flex",
    gap: "15px",
    marginBottom: "15px"
};

const inputStyle = {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
};

const thStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "left"
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc"
};

const linkButtonStyle = {
  display: "inline-block",
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px"
};

const deleteButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const noteCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px",
  backgroundColor: "#f9fafb"
};

export default ClaimDetailsPage;