export function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>😓</span> {message}
    </div>
  );
}
