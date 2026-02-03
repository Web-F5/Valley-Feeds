import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useParams} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useState, useEffect} from 'react';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
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
          <p>
            <strong>{product.title}</strong>
          </p>
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        <ul>
          {selectedOptions
            .filter((option) => option.value !== 'Default Title')
            .map((option) => (
              <li key={option.name}>
                <small>
                  {option.name}: {option.value}
                </small>
              </li>
            ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputQuantity, setInputQuantity] = useState(quantity.toString());
  const params = useParams();
  const locale = params.locale || 'en';

  // Sync inputQuantity with actual quantity when cart updates
  useEffect(() => {
    setInputQuantity(quantity.toString());
  }, [quantity]);

  const handleUpdate = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/${locale}/cart-update`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          lines: [{id: lineId, quantity: newQuantity}],
        }),
      });
      
      if (response.ok) {
        console.log('✅ Update successful, reloading page...');
        window.location.reload();
      } else {
        console.error('❌ Update failed:', response.status);
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuantity(e.target.value);
  };

  const handleQuantityBlur = () => {
    const newQty = parseInt(inputQuantity, 10);
    if (!isNaN(newQty) && newQty > 0 && newQty !== quantity) {
      handleUpdate(newQty);
    } else {
      setInputQuantity(quantity.toString());
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      console.log('🗑️ Removing item:', lineId);
      const response = await fetch(`/${locale}/cart-remove`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          lineIds: [lineId],
        }),
      });
      
      if (response.ok) {
        console.log('✅ Remove successful, reloading page...');
        window.location.reload();
      } else {
        console.error('❌ Remove failed:', response.status);
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Remove failed:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="cart-line-quantity" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
      
      <input
        type="number"
        value={inputQuantity}
        onChange={handleQuantityChange}
        onBlur={handleQuantityBlur}
        disabled={isUpdating}
        min="1"
        style={{width: '50px', textAlign: 'center', padding: '0.25rem'}}
      />
      
      <button 
        onClick={handleRemove} 
        disabled={isUpdating}
        style={{
          padding: '0.25rem 0.75rem',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          backgroundColor: 'white',
          border: '1px solid black',
          borderRadius: '4px'
        }}
      >
        Remove
      </button>
    </div>
  );
}