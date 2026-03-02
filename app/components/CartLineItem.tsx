import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

const WEIGHT_LIMIT_KG = 22;

export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions, weight, weightUnit} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // Calculate weight
  let weightInKg = 0;
  if (weight && weightUnit) {
    if (weightUnit === 'KILOGRAMS') {
      weightInKg = weight;
    } else if (weightUnit === 'GRAMS') {
      weightInKg = weight / 1000;
    } else if (weightUnit === 'POUNDS') {
      weightInKg = weight * 0.453592;
    } else if (weightUnit === 'OUNCES') {
      weightInKg = weight * 0.0283495;
    }
  }
  
  const isOverWeightLimit = weightInKg > WEIGHT_LIMIT_KG;

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
        
        {/* Heavy Item Warning */}
        {isOverWeightLimit && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '0.5rem',
            marginTop: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <div style={{display: 'flex', alignItems: 'start', gap: '0.5rem'}}>
              <span style={{fontSize: '1rem'}}>⚠️</span>
              <div style={{color: '#856404'}}>
                <strong className="block mb-1">Heavy Item Shipping Notice</strong>
                <p><strong className="block mb-1">Local delivery available within 100km of Katandra West.</strong></p>
                <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                <p>Outside this range will require you to arrange a courier.</p>
              </div>
            </div>
          </div>
        )}

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
      {/* 1. MINUS BUTTON - No onClick needed! */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity - 1}],
        }}
      >
        <button 
          disabled={quantity <= 1} 
          className="qty-btn" 
          type="submit"
          style={{width: '30px', height: '30px'}}
        >
          -
        </button>
      </CartForm>

      {/* 2. QUANTITY DISPLAY */}
      <span style={{fontWeight: 'bold', minWidth: '20px', textAlign: 'center'}}>
        {quantity}
      </span>

      {/* 3. PLUS BUTTON - No onClick needed! */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity + 1}],
        }}
      >
        <button 
          className="qty-btn" 
          type="submit"
          style={{width: '30px', height: '30px'}}
        >
          +
        </button>
      </CartForm>

      {/* 4. REMOVE BUTTON - No onClick needed! */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [lineId]}}
      >
        <button 
          type="submit"
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