import type {CartLayout} from '~/components/CartMain';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useParams, useRevalidator} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useState, useEffect} from 'react';
import {CartForm} from '@shopify/hydrogen';
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

  return (
    <div className="cart-line-quantity" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'}}>
      {/* 1. QUANTITY UPDATE FORM */}
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity - 1}],
        }}
      >
        <button disabled={quantity <= 1} className="qty-btn">-</button>
      </CartForm>

      <span className="px-2">{quantity}</span>

      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{
          lines: [{id: lineId, quantity: quantity + 1}],
        }}
      >
        <button className="qty-btn">+</button>
      </CartForm>

      {/* 2. REMOVE ITEM FORM */}
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
            borderRadius: '4px'
          }}
        >
          Remove
        </button>
      </CartForm>
    </div>
  );
}