import "./Background.css";

export default function Background({ backgroundImg }) {
  return (
    <div
      className="App-background"
      style={{ backgroundImage: `url(${backgroundImg})` }}
      aria-hidden="true"
    />
  );
}
