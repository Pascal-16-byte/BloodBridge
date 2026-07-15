import { FiLoader } from 'react-icons/fi';
import PrimaryButton from '../buttons/PrimaryButton';

function LoadingButton({ isLoading, loadingText = 'Please wait...', children, ...props }) {
  return (
    <PrimaryButton disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <FiLoader className="animate-spin" size={18} />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </PrimaryButton>
  );
}

export default LoadingButton;
