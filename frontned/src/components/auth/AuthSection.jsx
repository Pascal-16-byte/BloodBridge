import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { authTypography } from '../ui/authStyles';

function AuthSection({ title, description, icon: Icon, children, className = '' }) {
  return (
    <Card padding="lg" className={className}>
      <motion.div layout className="space-y-6">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-primary">
              <Icon size={18} />
            </div>
          ) : null}
          <div className="min-w-0">
            <h3 className={authTypography.sectionHeading}>{title}</h3>
            {description ? <p className={`mt-2 ${authTypography.helper}`}>{description}</p> : null}
          </div>
        </div>
        {children}
      </motion.div>
    </Card>
  );
}

export default AuthSection;
