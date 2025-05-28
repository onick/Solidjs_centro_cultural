import { children } from 'solid-js';

function Button(props) {
  const c = children(() => props.children);
  
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variant = variants[props.variant] || variants.primary;
  const size = sizes[props.size] || sizes.md;
  
  return (
    <button
      type={props.type || 'button'}
      class={`${baseClasses} ${variant} ${size} ${props.class || ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      {...props}
    >
      {props.loading && (
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
      )}
      {c()}
    </button>
  );
}

export default Button;