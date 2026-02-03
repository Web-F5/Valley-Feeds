import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

responseHeaders.set('Content-Type', 'text/html');

// Debug: log the original header
console.log('Original CSP header:', header);

// Parse and modify the CSP header
let updatedHeader = header;

/// Replace or add frame-src directive
if (updatedHeader.includes('frame-src')) {
  updatedHeader = updatedHeader.replace(
    /frame-src[^;]*/,
    "frame-src 'self' https://www.youtube.com https://maps.google.com https://maps.googleapis.com https://www.google.com"
  );
} else {
  updatedHeader += "; frame-src 'self' https://www.youtube.com https://maps.google.com https://maps.googleapis.com https://www.google.com";
}

// Replace or add img-src directive
if (updatedHeader.includes('img-src')) {
  updatedHeader = updatedHeader.replace(
    /img-src[^;]*/,
    "img-src 'self' https://cdn.shopify.com https://img.youtube.com https://maps.googleapis.com https://maps.google.com https://www.google.com data:"
  );
} else {
  updatedHeader += "; img-src 'self' https://cdn.shopify.com https://img.youtube.com https://maps.googleapis.com https://maps.google.com https://www.google.com data:";
}


console.log('Updated CSP header:', updatedHeader);
// Delete any existing CSP header first, then set the new one
responseHeaders.delete('Content-Security-Policy');
responseHeaders.set('Content-Security-Policy', updatedHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
