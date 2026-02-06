import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router'; // Stick to 'react-router'
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';
import {useFetcher} from 'react-router'; // Add this to your imports

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // Define this INSIDE the component
  const cartRoute = '/cart';

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
        >
          <p><strong>{product.title}</strong></p>
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        <ul>
          {selectedOptions
            .filter((option) => option.value !== 'Default Title')
            .map((option) => (
              <li key={option.name}>
                <small>{option.name}: {option.value}</small>
              </li>
            ))}
        </ul>
        
        <div style={{display: 'flex', alignItems: 'center', marginTop: '0.5rem'}}>
          {/* We pass the cartRoute down or just use /cart inside the child */}
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;

  return (
    <div className="cart-line-quantity" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
      {/* 1. MINUS BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity - 1}],
        }}
      >
        <button disabled={quantity <= 0} className="qty-btn" 
        onClick={() => setTimeout(() => window.location.reload(), 500)} // 0.5s delay
        style={{width: '30px', height: '30px'}}>-</button>
      </CartForm>

      {/* 2. QUANTITY DISPLAY */}
      <span style={{fontWeight: 'bold', minWidth: '20px', textAlign: 'center'}}>{quantity}</span>

      {/* 3. PLUS BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity + 1}],
        }}
      >
        <button className="qty-btn" 
        onClick={() => setTimeout(() => window.location.reload(), 500)} // 0.5s delay
        style={{width: '30px', height: '30px'}}>+</button>
      </CartForm>

      {/* 4. REMOVE BUTTON (The Trigger) */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [lineId]}}
      >
        <button 
          type="submit"
          onClick={() => setTimeout(() => window.location.reload(), 800)} // slightly longer for removal
          style={{
            padding: '0.25rem 0.75rem',
            cursor: 'pointer',
            marginLeft: '0.5rem',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Remove
        </button>
      </CartForm>
    </div>
  );
}