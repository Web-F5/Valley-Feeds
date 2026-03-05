import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';
import {useState, useRef, useEffect} from 'react';

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
  const [optimisticQuantity, setOptimisticQuantity] = useState(quantity);
  const [pendingUpdate, setPendingUpdate] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync optimistic quantity when actual quantity changes
  useEffect(() => {
    setOptimisticQuantity(quantity);
    setPendingUpdate(null);
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update UI immediately
    setOptimisticQuantity(newQuantity);
    setPendingUpdate(newQuantity);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the actual form submission
    timeoutRef.current = setTimeout(() => {
      // Submit the form programmatically
      const form = document.getElementById(`update-form-${lineId}`) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 800); // Wait 800ms after last click before submitting
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="cart-line-quantity" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
      
      {/* MINUS BUTTON */}
      <button 
        disabled={optimisticQuantity <= 1} 
        onClick={() => handleQuantityChange(optimisticQuantity - 1)}
        style={{
          width: '30px', 
          height: '30px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: optimisticQuantity > 1 ? 'pointer' : 'not-allowed',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        −
      </button>

      {/* QUANTITY DISPLAY with pending indicator */}
      <span style={{
        fontWeight: 'bold', 
        minWidth: '30px', 
        textAlign: 'center',
        color: pendingUpdate !== null ? '#10b981' : 'inherit',
      }}>
        {optimisticQuantity}
      </span>

      {/* PLUS BUTTON */}
      <button 
        onClick={() => handleQuantityChange(optimisticQuantity + 1)}
        style={{
          width: '30px', 
          height: '30px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        +
      </button>

      {/* Hidden form that will be submitted after debounce */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: pendingUpdate || optimisticQuantity}],
        }}
      >
        <form id={`update-form-${lineId}`} style={{display: 'none'}}>
          <button type="submit" />
        </form>
      </CartForm>

      {/* REMOVE BUTTON */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesRemove}
        inputs={{lineIds: [lineId]}}
      >
        <button 
          type="submit"
          style={{
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            marginLeft: '0.5rem',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          Remove
        </button>
      </CartForm>
    </div>
  );
}