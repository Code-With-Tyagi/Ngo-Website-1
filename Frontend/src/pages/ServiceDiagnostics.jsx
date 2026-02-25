import React from "react";

function ServiceDiagnostics() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f0f0",
      padding: "40px 20px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      color: "#333"
    }}>
      <h1>✅ Service Page Loaded Successfully!</h1>
      <p style={{ fontSize: "1.2rem", color: "#2e7d32" }}>
        If you see this message, routing is working correctly.
      </p>
      
      <div style={{
        background: "#fff",
        border: "2px solid #2e7d32",
        borderRadius: "8px",
        padding: "30px",
        maxWidth: "600px",
        margin: "20px auto",
        textAlign: "left"
      }}>
        <h2 style={{ color: "#2e7d32" }}>Diagnostic Information:</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>Current Path:</strong> {window.location.pathname}</li>
          <li><strong>Current Host:</strong> {window.location.host}</li>
          <li><strong>Routing Status:</strong> ✅ React Router Working</li>
          <li><strong>Components:</strong> ✅ Loading Correctly</li>
        </ul>
      </div>

      <div style={{ marginTop: "40px", color: "#666" }}>
        <p><strong>If you're seeing a blank page instead of this:</strong></p>
        <ul style={{ textAlign: "left", maxWidth: "500px", margin: "20px auto" }}>
          <li>1. Check browser console (F12) for errors</li>
          <li>2. Clear browser cache (Ctrl+Shift+Del)</li>
          <li>3. Restart dev server (Ctrl+C in terminal, then npm run dev)</li>
          <li>4. Hard refresh page (Ctrl+Shift+R)</li>
        </ul>
      </div>
    </div>
  );
}

export default ServiceDiagnostics;
