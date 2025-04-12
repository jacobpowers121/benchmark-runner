import UserCard from "../components/UserCard";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      {[...Array(6)].map((_, i) => (
        <UserCard key={i} id={i} />
      ))}
    </div>
  );
}
