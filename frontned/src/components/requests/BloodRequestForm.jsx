import { CalendarDays, Hospital, MapPinned, PhoneCall, Save, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PrimaryButton from '../buttons/PrimaryButton';
import ErrorMessage from '../ui/ErrorMessage';
import LoadingButton from '../ui/LoadingButton';
import { bloodGroups } from '../../constants/bloodGroups';

const urgencyOptions = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const statusOptions = ['PENDING', 'ACTIVE', 'FULFILLED', 'CANCELLED'];

const inputClassName =
  'w-full rounded-[22px] border border-rose-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-rose-100';

const defaultValues = {
  patientName: '',
  bloodGroup: '',
  unitsRequired: '',
  hospitalName: '',
  hospitalAddress: '',
  city: '',
  district: '',
  state: '',
  contactPerson: '',
  contactNumber: '',
  urgency: 'HIGH',
  requiredBefore: '',
  notes: '',
  status: 'PENDING',
};

function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
        {Icon ? <Icon size={16} className="text-primary" /> : null}
        {label}
      </span>
      {children}
      <ErrorMessage message={error} />
    </label>
  );
}

function BloodRequestForm({ initialValues, submitLabel = 'Save Request', loadingText = 'Saving...', isSubmitting = false, onSubmit, onCancel, allowStatus = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm({
    defaultValues: { ...defaultValues, ...initialValues },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({ ...defaultValues, ...initialValues });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 md:grid-cols-2">
      <Field label="Patient Name" icon={UserRound} error={errors.patientName?.message}>
        <input
          className={inputClassName}
          {...register('patientName', {
            required: 'Patient name is required',
            maxLength: { value: 120, message: 'Patient name must not exceed 120 characters' },
          })}
        />
      </Field>

      <Field label="Blood Group Needed" error={errors.bloodGroup?.message}>
        <select className={inputClassName} {...register('bloodGroup', { required: 'Blood group is required' })}>
          <option value="">Select blood group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Units Required" error={errors.unitsRequired?.message}>
        <input
          className={inputClassName}
          type="number"
          min="1"
          max="20"
          {...register('unitsRequired', {
            required: 'Units required is required',
            valueAsNumber: true,
            min: { value: 1, message: 'At least 1 unit is required' },
            max: { value: 20, message: 'Units required must not exceed 20' },
          })}
        />
      </Field>

      <Field label="Urgency" error={errors.urgency?.message}>
        <select className={inputClassName} {...register('urgency', { required: 'Urgency is required' })}>
          {urgencyOptions.map((urgency) => (
            <option key={urgency} value={urgency}>
              {urgency}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Hospital Name" icon={Hospital} error={errors.hospitalName?.message}>
        <input
          className={inputClassName}
          {...register('hospitalName', {
            required: 'Hospital name is required',
            maxLength: { value: 160, message: 'Hospital name must not exceed 160 characters' },
          })}
        />
      </Field>

      <Field label="Hospital Address" icon={MapPinned} error={errors.hospitalAddress?.message}>
        <input
          className={inputClassName}
          {...register('hospitalAddress', {
            required: 'Hospital address is required',
            maxLength: { value: 255, message: 'Hospital address must not exceed 255 characters' },
          })}
        />
      </Field>

      <Field label="City" error={errors.city?.message}>
        <input className={inputClassName} {...register('city', { required: 'City is required', maxLength: { value: 80, message: 'City must not exceed 80 characters' } })} />
      </Field>

      <Field label="District" error={errors.district?.message}>
        <input className={inputClassName} {...register('district', { required: 'District is required', maxLength: { value: 80, message: 'District must not exceed 80 characters' } })} />
      </Field>

      <Field label="State" error={errors.state?.message}>
        <input className={inputClassName} {...register('state', { required: 'State is required', maxLength: { value: 80, message: 'State must not exceed 80 characters' } })} />
      </Field>

      <Field label="Required Before" icon={CalendarDays} error={errors.requiredBefore?.message}>
        <input
          className={inputClassName}
          type="datetime-local"
          {...register('requiredBefore', {
            required: 'Required before is required',
            validate: (value) => new Date(value) > new Date() || 'Required before must be in the future',
          })}
        />
      </Field>

      <Field label="Contact Person" icon={UserRound} error={errors.contactPerson?.message}>
        <input
          className={inputClassName}
          {...register('contactPerson', {
            required: 'Contact person is required',
            maxLength: { value: 120, message: 'Contact person must not exceed 120 characters' },
          })}
        />
      </Field>

      <Field label="Contact Number" icon={PhoneCall} error={errors.contactNumber?.message}>
        <input
          className={inputClassName}
          {...register('contactNumber', {
            required: 'Contact number is required',
            pattern: { value: /^[0-9+\-\s]{8,20}$/, message: 'Contact number must be 8 to 20 digits or symbols' },
          })}
        />
      </Field>

      {allowStatus ? (
        <Field label="Status" error={errors.status?.message}>
          <select className={inputClassName} {...register('status')}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      <div className="md:col-span-2">
        <Field label="Additional Notes" error={errors.notes?.message}>
          <textarea
            className={`${inputClassName} min-h-32 resize-none`}
            {...register('notes', {
              maxLength: { value: 500, message: 'Notes must not exceed 500 characters' },
            })}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row">
        <LoadingButton type="submit" isLoading={isSubmitting || formSubmitting} loadingText={loadingText} className="w-full">
          <Save size={18} /> {submitLabel}
        </LoadingButton>
        {onCancel ? (
          <PrimaryButton type="button" onClick={onCancel} className="w-full bg-slate-700 hover:bg-slate-800">
            Cancel
          </PrimaryButton>
        ) : null}
      </div>
    </form>
  );
}

export default BloodRequestForm;
