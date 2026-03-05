import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {type OptimisticCart} from '@shopify/hydrogen';
import {Button} from '~/components/ui/button';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="text-right mb-4">
        <span className="text-base font-semibold">Subtotal: </span>
        <span className="text-base font-semibold">
          {cart?.cost?.subtotalAmount?.amount ? (
            <>
              {new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
              }).format(Number(cart.cost.subtotalAmount.amount))}
            </>
          ) : (
            '-'
          )}
        </span>
      </div>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4 pb-2">
      <Button asChild className="w-full !text-white" size="lg">
        <a href={checkoutUrl} target="_self">
          Continue to Checkout
        </a>
      </Button>
    </div>
  );
}