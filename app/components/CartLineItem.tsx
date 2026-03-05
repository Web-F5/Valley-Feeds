import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useNavigation} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';
import {useState} from 'react';

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
  const [showTooltip, setShowTooltip] = useState(false);

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
    <li key={id} className="cart-line" style={{position: 'relative', overflow: 'visible'}}>
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
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
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
          
          {isOverWeightLimit && (
            <span 
              className="relative inline-block flex-shrink-0"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(!showTooltip);
              }}
              style={{cursor: 'pointer'}}
            >
              <span className="text-amber-600 text-base">⚠️</span>
              
              {showTooltip && (
                <>
                  <div className="hidden md:block fixed w-64 bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-[9999]"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="text-xs text-amber-800">
                      <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                      <p><strong className="block mb-1">Local delivery available within 100km of Katandra West only.</strong></p>
                      <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                      <p>Outside this range will require you to arrange a courier.</p>
                    </div>
                  </div>
                  
                  <div className="md:hidden fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[85vw] max-w-sm bg-amber-50 border border-amber-200 rounded-md p-3 shadow-lg z-[9999]">
                    <div className="text-xs text-amber-800">
                      <strong className="block mb-1 underline decoration-amber-600">Shipping Notice</strong>
                      <p><strong className="block mb-1">Local delivery available within 100km of Katandra West only.</strong></p>
                      <p>This item exceeds Aus Post's 22kg limit, or restricted via Aus Post rules.</p> 
                      <p>Outside this range will require you to arrange a courier.</p>
                    </div>
                  </div>
                </>
              )}
            </span>
          )}
        </div>
        
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
        
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const navigation = useNavigation();
  
  // Check if any form is submitting
  const isUpdating = navigation.state === 'submitting' || navigation.state === 'loading';

  return (
    <div className="cart-line-quantity" style={{position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
      {/* Loading Overlay */}
      {isUpdating && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: '4px',
        }}>
          <div className="spinner" style={{
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}

      {/* MINUS BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: Math.max(1, quantity - 1)}],
        }}
      >
        <button 
          disabled={quantity <= 1 || isUpdating} 
          type="submit"
          style={{
            width: '30px', 
            height: '30px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: (quantity > 1 && !isUpdating) ? 'pointer' : 'not-allowed',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: isUpdating ? 0.5 : 1,
          }}
        >
          −
        </button>
      </CartForm>

      {/* QUANTITY DISPLAY */}
      <span style={{fontWeight: 'bold', minWidth: '30px', textAlign: 'center'}}>
        {quantity}
      </span>

      {/* PLUS BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity + 1}],
        }}
      >
        <button 
          disabled={isUpdating}
          type="submit"
          style={{
            width: '30px', 
            height: '30px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            opacity: isUpdating ? 0.5 : 1,
          }}
        >
          +
        </button>
      </CartForm>

      {/* REMOVE BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [lineId]}}
      >
        <button 
          disabled={isUpdating}
          type="submit"
          style={{
            padding: '0.4rem 0.75rem',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            marginLeft: '0.5rem',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            fontSize: '12px',
            opacity: isUpdating ? 0.5 : 1,
          }}
        >
          Remove
        </button>
      </CartForm>
    </div>
  );
}