function Button(props) {
  const {
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    onClick,
    children,
    type = 'button',
    class: className = '',
    ...rest
  } = props;

  const buttonClass = () => {
    const baseClass = 'ccb-button';
    const variantClass = `button-${variant}`;
    const sizeClass = `button-${size}`;
    const stateClass = disabled ? 'button-disabled' : '';
    const loadingClass = loading ? 'button-loading' : '';
    
    return [baseClass, variantClass, sizeClass, stateClass, loadingClass, className]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <button
      type={type}
      class={buttonClass()}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span class="button-spinner">⏳</span>}
      <span class="button-content">{children}</span>
    </button>
  );
}

export default Button;