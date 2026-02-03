import {data} from 'react-router';

export async function action({request, context}: {request: Request; context: any}) {
  const {cart} = context;

  try {
    const body = await request.text();
    const parsedData = JSON.parse(body) as {lineIds: string[]};

    const result = await cart.removeLines(parsedData.lineIds);

    const headers = new Headers();
    if (result?.cart?.id) {
      const cookieHeader = cart.setCartId(result.cart.id);
      headers.set('Set-Cookie', cookieHeader.get('Set-Cookie') || '');
    }

    return data({success: true, cart: result.cart}, {status: 200, headers});
  } catch (error) {
    console.error('Cart remove error:', error);
    return data({success: false, error: error instanceof Error ? error.message : 'Unknown error'}, {status: 500});
  }
}

export async function loader() {
  return new Response(null, {status: 405});
}