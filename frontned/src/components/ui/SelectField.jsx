import { useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ErrorMessage from './ErrorMessage';
import { authTypography, fieldStyles } from './authStyles';

function SelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  options = [],
  placeholder,
  className = '',
  ...props
}) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={`${fieldStyles.wrapper} ${error ? 'animate-shake' : ''}`}>
      <label htmlFor={id} className={authTypography.label}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`.trim() || undefined}
          className={`${fieldStyles.control} ${fieldStyles.controlWithRightIcon} appearance-none ${
            error ? fieldStyles.error : fieldStyles.normal
          } ${value ? 'text-text' : 'text-slate-400'} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder || `Select ${label}`}
          </option>
          {options.map((option) => (
            <option key={option.value || option} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <FiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
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

export default SelectField;
