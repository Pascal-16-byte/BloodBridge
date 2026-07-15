import { useId } from 'react';
import ErrorMessage from './ErrorMessage';
import SelectField from './SelectField';
import { authTypography, fieldStyles } from './authStyles';

function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  as = 'input',
  options = [],
  helperText,
  className = '',
  ...props
}) {
  const id = useId();
  const Element = as;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  if (as === 'select') {
    return (
      <SelectField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        options={options}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div className={`${fieldStyles.wrapper} ${error ? 'animate-shake' : ''}`}>
      <label htmlFor={id} className={authTypography.label}>
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <span className={fieldStyles.icon}>
            <Icon size={18} />
          </span>
        ) : null}
        <Element
          id={id}
          name={name}
          type={type}
          value={type === 'file' ? undefined : value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim() || undefined}
          className={`${fieldStyles.control} ${Icon ? fieldStyles.controlWithLeftIcon : ''} ${
            type === 'date' ? fieldStyles.controlWithRightIcon : ''
          } ${
            error ? fieldStyles.error : fieldStyles.normal
          } ${type === 'date' ? 'auth-date-input' : ''} ${className}`}
          {...props}
        />
      </div>
      {helperText ? (
        <p id={helperId} className={authTypography.helper}>
          {helperText}
        </p>
      ) : null}
      <div id={error ? errorId : undefined}>
        <ErrorMessage message={error} />
      </div>
    </div>
  );
}

export default InputField;
