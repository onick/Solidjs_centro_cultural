import { children, createEffect, Show } from 'solid-js';

function Modal(props) {
  const c = children(() => props.children);

  // Bloquear scroll cuando el modal está abierto
  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && props.onClose) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div 
        class="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        {/* Modal container */}
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            class={`relative bg-white rounded-lg shadow-xl w-full transition-all ${
              props.size === 'sm' ? 'max-w-md' :
              props.size === 'lg' ? 'max-w-4xl' :
              props.size === 'xl' ? 'max-w-6xl' :
              'max-w-2xl'
            }`}
          >
            {/* Header */}
            <Show when={props.title || props.onClose}>
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <Show when={props.title}>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {props.title}
                  </h3>
                </Show>
                <Show when={props.onClose}>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={props.onClose}
                  >
                    <span class="sr-only">Cerrar</span>
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Show>
              </div>
            </Show>

            {/* Content */}
            <div class="p-6">
              {c()}
            </div>

            {/* Footer */}
            <Show when={props.footer}>
              <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                {props.footer}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default Modal;