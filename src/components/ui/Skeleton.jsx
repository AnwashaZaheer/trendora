

export const Skeleton = ({
  className = '',
  variant = 'rect', // 'rect', 'circle', 'text'
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-800';
  
  const variants = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'h-4 rounded w-full',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

// Ready-made compound skeletons
export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col border border-slate-100 dark:border-slate-900 rounded-2xl p-4 bg-white dark:bg-slate-900/50 shadow-sm gap-4">
      <Skeleton variant="rect" className="aspect-square w-full" />
      <div className="flex flex-col gap-2.5">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="rect" className="w-10 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
