import { motion } from 'framer-motion';
import { useId, useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import ErrorMessage from './ErrorMessage';
import { authTypography, fieldStyles } from './authStyles';

function PasswordField({ label, name, value, onChange, onBlur, error, helperText, strength, ...props }) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className={`${fieldStyles.wrapper} ${error ? 'animate-shake' : ''}`}>
      <label htmlFor={id} className={authTypography.label}>
        {label}
      </label>
      <div className="relative">
        <span className={fieldStyles.icon}>
          <FiLock size={18} />
        </span>
        <input
          id={id}
          name={name}
          type={isVisible ? 'text' : 'password'}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperText ? helperId : ''} ${strength ? `${id}-strength` : ''} ${
            error ? errorId : ''
          }`.trim() || undefined}
          className={`${fieldStyles.control} ${fieldStyles.controlWithLeftIcon} ${fieldStyles.controlWithRightIcon} ${
            error ? fieldStyles.error : fieldStyles.normal
          }`}
          {...props}
        />
        <button
          type="button"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((current) => !current)}
          className={fieldStyles.rightIconButton}
        >
          {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {helperText ? (
        <p id={helperId} className={authTypography.helper}>
          {helperText}
        </p>
      ) : null}
      {strength ? (
        <motion.div id={`${id}-strength`} layout className="space-y-2 rounded-2xl border border-rose-100 bg-white/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={authTypography.helper}>Use mixed case, numbers, and symbols.</p>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-primary">
              {strength.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition ${index < strength.score ? strength.color : 'bg-rose-100'}`}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
      <div id={error ? errorId : undefined}>
        <ErrorMessage message={error} />
      </div>
    </div>
  );
}

export default PasswordField;
