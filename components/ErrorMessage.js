// Reusable feedback component — keeps error UI consistent across forms and pages.
// The parent decides the message; this component decides how an error looks.
function ErrorMessage({ message }) {
  // Conditional rendering — returning null means React renders nothing when there is no error message.
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export default ErrorMessage;
