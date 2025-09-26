import { useParams } from "@tanstack/react-router";
import { Route as UserRoute } from "@/routes/_protected/admin/users/$userId";
import type { SingleUser } from "@/context/types";
import "@/css/userspage.css";

import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { TOKEN } from "@/utils/Constants";

async function fetchUser(userId: number): Promise<SingleUser["user"]> {
  const res = await fetch(`/api/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  const data: SingleUser = await res.json();
  return data.user;
}

function UsersPageId() {
  const { userId } = useParams({ from: UserRoute.id });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(Number(userId)),
    enabled: !!userId, 
  });

  if (isLoading) {
    return (
      <div className="user-loading" >
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="user-error">Error loading user</div>;
  }

  if (!user) {
    return <div className="user-empty">No user data available</div>;
  }

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
              src={user.avatar_url || "/helpdesk-logo.png"}
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
