
import type {Route} from './+types/cart-clean';
import {data} from 'react-router';

export async function action({context}: Route.ActionArgs) {
  const {cart} = context;

  try {
    const currentCart = await cart.get();

    if (!currentCart?.lines?.nodes?.length) {
      return data({success: true, message: 'Cart is already empty'});
    }

    const lineIds = currentCart.lines.nodes.map((line: any) => line.id);
    const result = await cart.removeLines(lineIds);

    const headers = new Headers();
    if (result?.cart?.id) {
      const cookieHeader = cart.setCartId(result.cart.id);
      headers.set('Set-Cookie', cookieHeader.get('Set-Cookie') || '');
    }

    return data({success: true, cart: result.cart}, {status: 200, headers});
  } catch (error) {
    console.error('Cart clean error:', error);
    return data({success: false, error: error instanceof Error ? error.message : 'Unknown error'}, {status: 500});
  }
}

export async function loader() {
  return new Response(null, {status: 405});
}