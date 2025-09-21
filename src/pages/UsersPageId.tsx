import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Route as UserRoute } from "@/routes/_protected/admin/$userId";
import type { SingleUser } from "@/context/types.ts";
import "@/css/userspage.css";

import Loader from "@/components/Loader.tsx";
import {useUsers} from "@/hooks/hooks.tsx";

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
        console.log("UserId param changed:", userId);

        fetchUser();
        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (loading || contextLoading) return <div className="user-loading"><Loader/></div>;
    if (error || contextError) return <div className="user-error">{error || contextError}</div>;
    if (!user) return <div className="user-empty">No user data available</div>;

    return (
        <div className="user-container">
            <div className="user-avatar">
                <img
                    src={user.avatar_url || "/svgs/user-placeholder.svg"}
                    alt={user.name}
                />
            </div>

            <div className="user-details">
                <h2 className="user-title">{user.name}</h2>
                <p><strong>Email:</strong></p> <p>{user.email}</p>
                <p><strong>Role:</strong></p> <p>{user.role}</p>
                <p><strong>Status:</strong></p> <p>{user.status}</p>
                <p><strong>Google ID:</strong></p> <p>{user.google_id}</p>
                <p><strong>Created At:</strong></p> <p>{new Date(user.created_at).toLocaleString()}</p>
                <p><strong>Updated At:</strong></p> <p>{new Date(user.updated_at).toLocaleString()}</p>
            </div>
        </div>
    );
}

export default UsersPageId;
