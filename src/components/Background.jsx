import "./Background.css";

export default function Background({ image }) {
  return (
    <div
      className="App-background"
      style={{ backgroundImage: `url(${image})` }}
      aria-hidden="true"
    />
  );
}
