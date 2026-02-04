import type {Route} from './+types/cart-add';
import {data} from 'react-router';

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  
  try {
    const body = await request.text();
    const parsedData = JSON.parse(body) as {merchandiseId: string; quantity?: number};
    
    const result = await cart.addLines([{
      merchandiseId: parsedData.merchandiseId,
      quantity: parsedData.quantity || 1,
    }]);
    
    const headers = new Headers();
    if (result?.cart?.id) {
      const cookieHeader = cart.setCartId(result.cart.id);
      headers.set('Set-Cookie', cookieHeader.get('Set-Cookie') || '');
    }
    
    return data({
      success: true,
      totalQuantity: result?.cart?.totalQuantity || 0,
    }, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('Cart add error:', error);
    return data({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500,
    });
  }
}

export async function loader() {
  return new Response(null, { status: 405 });
}