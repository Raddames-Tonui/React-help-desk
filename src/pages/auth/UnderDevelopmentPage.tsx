import "@/css/authPages.css";

export default function UnderDevelopmentPage() {
    return (
        <div className="auth-page">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="auth-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l3-1.5L15 20l-.75-3M19.5 11a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
            </svg>
            <h1 className="auth-title">🚧 Page Under Development 🚧</h1>
            <p className="auth-message">
                Our developers are still arguing about tabs vs spaces. <br />
                Come back when the dust settles 😅
            </p>
        </div>
    );
}
