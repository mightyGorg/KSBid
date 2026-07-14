import { useId } from "react";

const Field = ({ label, error, description, ...props }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="gel-form__divider">
      <label htmlFor={id}>
        {label}
        {description && <small>{description}</small>}
      </label>
      <input
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="gel-form__field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
