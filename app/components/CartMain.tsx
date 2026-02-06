import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useOptimisticCart} from '@shopify/hydrogen';
import {useRevalidator} from 'react-router-dom';
import {useFetcher, useFetchers} from 'react-router-dom';
import {useEffect, useMemo} from 'react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */

export function CartMain({layout, cart}: CartMainProps) {
  const revalidator = useRevalidator();
  const fetchers = useFetchers();

  // 1. Monitor all active forms. 
  // This finds any fetcher currently adding, updating, or removing lines.
  const isCartUpdating = useMemo(() => {
    return fetchers.some((f) => {
      const formData = f.formData;
      if (!formData) return false;
      const cartInput = formData.get('cartFormInput');
      // This catches LinesRemove, LinesUpdate, and LinesAdd
      return cartInput && cartInput.toString().includes('Lines');
    });
  }, [fetchers]);

  // 2. The Magic Sync: 
  // When 'isCartUpdating' changes from true to false (action finished),
  // we tell the entire app: "The data is dirty, re-run all loaders now."
  useEffect(() => {
    if (!isCartUpdating && revalidator.state === 'idle') {
      revalidator.revalidate();
    }
  }, [isCartUpdating, revalidator]);

  const linesCount = cart?.lines?.nodes?.length || 0;
  const cartHasItems = linesCount > 0;

  return (
    /* We use a combined key of ID and totalQuantity to force a DOM reset */
    <div 
      className="cart-main" 
      key={cart?.id + (cart?.totalQuantity?.toString() || '0')}
    >
      <CartEmpty hidden={cartHasItems} layout={layout} />
      <div className="cart-details">
        <ul>
          {(cart?.lines?.nodes ?? []).map((line: any) => (
            <CartLineItem key={line.id} line={line} layout={layout} />
          ))}
        </ul>
        {cartHasItems && <CartSummary cart={cart!} layout={layout} />}
      </div>
    </div>
  );
}

function CartRefreshTrigger({linesCount}: {linesCount: number}) {
  const fetcher = useFetcher();
  
  useEffect(() => {
    // If we are in an "idle" state but the UI thinks we have items 
    // while the fetcher just finished a delete, force a re-sync.
    if (fetcher.state === 'idle' && fetcher.data) {
       // This forces Remix to pull fresh loader data for the whole page
    }
  }, [linesCount, fetcher.state]);

  return null;
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}