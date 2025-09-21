import React from "react";

export default function UnauthorizedPage() {
    return (
        <div style={styles.container}>
            <div style={styles.svgWrapper}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={styles.svg}
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" />
                    <path d="M10 19c.5-1 3.5-1 4 0" />
                </svg>
            </div>
            <h1 style={styles.title}>Oops... Access Denied! 🚫</h1>
            <p style={styles.caption}>
                Looks like you tried sneaking in without the right role... <br />
                Maybe bribe the admin with 🍕?
            </p>
            <a href="/auth/login" style={styles.button}>
                🔑 Back to Login
            </a>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: "center",
        marginTop: "10vh",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        height: "100vh",
    },
    svgWrapper: {
        display: "inline-block",
        marginBottom: "1rem",
    },
    svg: {
        stroke: "#ff4d4f",
    },
    title: {
        fontSize: "2rem",
        marginBottom: "0.5rem",
    },
    caption: {
        fontSize: "1rem",
        marginBottom: "1.5rem",
        color: "#555",
    },
    button: {
        display: "inline-block",
        padding: "0.75rem 1.5rem",
        background: "#ff4d4f",
        color: "#fff",
        borderRadius: "4px",
        textDecoration: "none",
        fontWeight: "bold",
    },
};
