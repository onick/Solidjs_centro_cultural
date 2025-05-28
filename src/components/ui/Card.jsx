import { children } from 'solid-js';

function Card(props) {
  const {
    title,
    subtitle,
    image,
    variant = 'default',
    hover = true,
    clickable = false,
    onClick,
    class: className = '',
    children: cardChildren,
    ...rest
  } = props;

  const c = children(() => cardChildren);

  const cardClass = () => {
    const baseClass = 'ccb-card';
    const variantClass = `card-${variant}`;
    const hoverClass = hover ? 'card-hover' : '';
    const clickableClass = clickable ? 'card-clickable' : '';
    
    return [baseClass, variantClass, hoverClass, clickableClass, className]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div
      class={cardClass()}
      onClick={clickable ? onClick : undefined}
      {...rest}
    >
      {image && (
        <div class="card-image">
          <img src={image} alt={title || 'Card image'} />
        </div>
      )}
      
      <div class="card-content">
        {title && <h3 class="card-title">{title}</h3>}
        {subtitle && <p class="card-subtitle">{subtitle}</p>}
        
        <div class="card-body">
          {c()}
        </div>
      </div>
    </div>
  );
}

export default Card;
