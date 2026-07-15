import { useId } from "react";

const Field = ({ label, error, description, multiline, ...props }) => {
  const id = useId();
  const errorId = `${id}-error`;
  const Control = multiline ? "textarea" : "input";

  return (
    <div className="gel-form__divider">
      <label htmlFor={id}>
        {label}
        {description && <small>{description}</small>}
      </label>
      <Control
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
