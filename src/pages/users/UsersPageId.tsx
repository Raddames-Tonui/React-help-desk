import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as UserRoute } from "@/routes/_protected/admin/$userId";
import type { SingleUser } from "@/context/types.ts";
import "@/css/userspage.css";

import Loader from "@/components/Loader.tsx";
import { useUsers } from "@/context/hooks";

function UsersPageId() {
    const { userId } = useParams({ from: UserRoute.id });
    const { viewUserPage, isLoading: contextLoading, error: contextError } = useUsers();
    const [user, setUser] = useState<SingleUser["user"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        let isMounted = true;

        const fetchUser = async () => {
            setLoading(true);
            const userData = await viewUserPage(Number(userId));
            if (!isMounted) return;

            if (!userData) setError("User not found");
            else setUser(userData);

            setLoading(false);
        };
        // console.log("UserId param changed:", userId);

        fetchUser();
        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (loading || contextLoading) return <div className="user-loading"><Loader /></div>;
    if (error || contextError) return <div className="user-error">{error || contextError}</div>;
    if (!user) return <div className="user-empty">No user data available</div>;

    return (
        <div>
            <div className="page-header">
                <h1>User Details</h1>
            </div>
            <div className="s-page-container">
                <div className="s-page-details">
                    <h2 className="s-page-title">{user.name}</h2>
                    <div className="s-page-avatar">
                        <img
                            src={user.avatar_url || "/svgs/user-placeholder.svg"}
                            alt={user.name}
                        />
                    </div>
                    <dl>
                        <dt>Email:</dt>
                        <dd>{user.email}</dd>

                        <dt>Role:</dt>
                        <dd>{user.role}</dd>

                        <dt>Status:</dt>
                        <dd>{user.status}</dd>

                        <dt>Google ID:</dt>
                        <dd>{user.google_id}</dd>

                        <dt>Created At:</dt>
                        <dd>{new Date(user.created_at).toLocaleString()}</dd>

                        <dt>Updated At:</dt>
                        <dd>{new Date(user.updated_at).toLocaleString()}</dd>
                    </dl>
                </div>


            </div>


        </div>
    );
}

export default UsersPageId;
