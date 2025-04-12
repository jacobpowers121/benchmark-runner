import { useEffect, useState } from "react";
import axios from "axios";

type Props = { id: number };

export default function UserCard({ id }: Props) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${(id % 10) + 1}`)
      .then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading user #{id}...</p>;

  return (
    <div style={{ border: "1px solid gray", margin: "0.5rem", padding: "1rem" }}>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
    </div>
  );
}
