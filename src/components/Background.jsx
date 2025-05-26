import "./Background.css";

export default function Background({ image }) {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${image})` }}
      aria-hidden="true"
    />
  );
}
