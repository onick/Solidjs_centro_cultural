import { createSignal, Show } from 'solid-js';

function Modal(props) {
  const {
    isOpen,
    onClose,
    title,
    size = 'medium',
    closeOnOverlay = true,
    children,
    class: className = '',
    ...rest
  } = props;

  const modalClass = () => {
    const baseClass = 'ccb-modal';
    const sizeClass = `modal-${size}`;
    const openClass = isOpen() ? 'modal-open' : '';
    
    return [baseClass, sizeClass, openClass, className]
      .filter(Boolean)
      .join(' ');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay && onClose) {
      onClose();
    }
  };

  return (
    <Show when={isOpen()}>
      <div class="modal-overlay" onClick={handleOverlayClick}>
        <div class={modalClass()} {...rest}>
          <div class="modal-header">
            {title && <h2 class="modal-title">{title}</h2>}
            <button class="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          
          <div class="modal-body">
            {children}
          </div>
        </div>
      </div>
    </Show>
  );
}

export default Modal;
