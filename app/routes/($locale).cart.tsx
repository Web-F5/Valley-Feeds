import {useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  console.log('=== CART ACTION DEBUG ===');
  console.log('FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }

  // Check if this is a plain form submission
  const cartAction = formData.get('cartAction');
  
  if (cartAction === 'ADD_TO_CART') {
    // Handle plain form submission
    console.log('✅ Plain form submission detected');
    
    const merchandiseId = formData.get('lines[0][merchandiseId]') as string;
    const quantity = parseInt(formData.get('lines[0][quantity]') as string, 10);
    
    console.log('Merchandise ID:', merchandiseId);
    console.log('Quantity:', quantity);
    
    const result = await cart.addLines([{
      merchandiseId,
      quantity,
    }]);
    
    const cartId = result?.cart?.id;
    const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
    const {cart: cartResult, errors, warnings} = result;

    const redirectTo = formData.get('redirectTo') ?? null;
    let status = 200;
    if (typeof redirectTo === 'string') {
      status = 303;
      headers.set('Location', redirectTo);
    }

    console.log('✅ Cart action complete');
    console.log('=== END DEBUG ===');

    return data(
      {
        cart: cartResult,
        errors,
        warnings,
        analytics: {
          cartId,
        },
      },
      {status, headers},
    );
  }

  // Otherwise, handle CartForm submission
  let action: string | undefined;
  let inputs: any;
  
  try {
    const parsed = CartForm.getFormInput(formData);
    action = parsed.action;
    inputs = parsed.inputs;
    console.log('✅ CartForm parsed action:', action);
    console.log('✅ CartForm parsed inputs:', JSON.stringify(inputs, null, 2));
  } catch (error) {
    console.error('❌ Error parsing CartForm input:', error);
    throw error;
  }

  console.log('=== END DEBUG ===');

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines as any);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines as any);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds as any);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];
      if (inputs.discountCodes) {
        discountCodes.push(...(inputs.discountCodes as string[]));
      }
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      if (inputs.giftCardCodes) {
        giftCardCodes.push(...(inputs.giftCardCodes as string[]));
      }
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="cart">
      <h1>Cart</h1>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}