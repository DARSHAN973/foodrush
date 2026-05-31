function ErrorMessage({ message }) {
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