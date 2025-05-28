import { children } from 'solid-js';

function Card(props) {
  const c = children(() => props.children);
  
  return (
    <div class={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${props.class || ''}`}>
      {props.image && (
        <div class="h-48 bg-gradient-to-br from-blue-500 to-orange-500 relative overflow-hidden">
          {typeof props.image === 'string' ? (
            <img src={props.image} alt={props.title || 'Card image'} class="w-full h-full object-cover" />
          ) : (
            <div class="w-full h-full flex items-center justify-center text-white text-6xl">
              {props.image}
            </div>
          )}
          {props.badge && (
            <div class={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${props.badgeClass || 'bg-green-500 text-white'}`}>
              {props.badge}
            </div>
          )}
        </div>
      )}
      
      <div class="p-6">
        {props.title && (
          <h3 class="text-xl font-bold text-gray-800 mb-2">{props.title}</h3>
        )}
        
        {props.subtitle && (
          <p class="text-gray-600 mb-4">{props.subtitle}</p>
        )}
        
        <div class="content">
          {c()}
        </div>
        
        {props.footer && (
          <div class="mt-6 pt-4 border-t border-gray-200">
            {props.footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;