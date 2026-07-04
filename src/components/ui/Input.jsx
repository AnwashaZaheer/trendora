

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  placeholder = '',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        required={required}
        placeholder={placeholder}
        className={`px-4 py-3 rounded-xl border bg-white/50 text-slate-800 dark:bg-slate-900/50 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
          error
            ? 'border-rose-500 focus:ring-rose-500'
            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 focus:border-brand-500'
        }`}
        {...props}
      />
      
      {error && (
        <span className="text-xs text-rose-500 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
