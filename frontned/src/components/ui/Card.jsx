import { cardStyles } from './authStyles';

function Card({ children, className = '', padding = 'md', interactive = false }) {
  return (
    <div
      className={`${cardStyles.base} ${cardStyles.padding[padding] || cardStyles.padding.md} ${
        interactive ? cardStyles.interactive : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
