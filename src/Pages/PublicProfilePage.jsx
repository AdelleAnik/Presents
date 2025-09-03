import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const PUBLIC_PROFILE = gql`
  query PublicProfile($username: String!) {
    users(where: {username: {_eq: $username}}, limit: 1) {
      username
      display_name
      avatar_url
      giftsCheck(where: {is_public: {_eq: true}}, order_by: {created_at: desc}) {
        id
        name
        price
        description
        category
        url
        image_url
      }
    }
  }
`;

export default function PublicProfilePage() {
  const { username = "" } = useParams();
  const normalized = username.replace(/^:/, "");
  const ilikeValue = normalized;
  const { data, loading, error } = useQuery(PUBLIC_PROFILE, {
    variables: { username: ilikeValue },
  });

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error.message}</div>;

  const user = data?.users?.[0];
  if (!user) return <div style={{ padding: 24 }}>No user “{normalized}”.</div>;

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={`${user.username} avatar`}
            style={{ width: 64, height: 64, borderRadius: "50%" }}
          />
        )}
        <div>
          <h1>@{user.username}</h1>
          <p style={{ opacity: 0.7 }}>{user.display_name}</p>
        </div>
      </header>

      {user.gifts.length === 0 ? (
        <div>This user hasn’t published any gifts yet.</div>
      ) : (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
          {user.gifts.map((g) => (
            <li key={g.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 600 }}>{g.title}</div>
              {g.image_url && (
                <img
                  src={g.image_url}
                  alt={g.title}
                  style={{ borderRadius: 8, marginTop: 8, maxWidth: "100%" }}
                />
              )}
              {g.notes && <p style={{ fontSize: 14, marginTop: 8 }}>{g.notes}</p>}
              {g.url && (
                <a
                  href={g.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 14, marginTop: 8, display: "inline-block" }}
                >
                  Open link
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
