import {type LoaderFunctionArgs} from 'react-router';
import {useLoaderData} from 'react-router';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {page} = await storefront.query(DELIVERY_PAGE_QUERY);

  if (!page) {
    throw new Response('Page not found', {status: 404});
  }

  return {page};
}

export default function DeliveryPage() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-[#24282E] mb-8">{page.title}</h1>

      <div
        className="vf-prose"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: page.body}}
      />
    </div>
  );
}

const DELIVERY_PAGE_QUERY = `#graphql
  query DeliveryPage {
    page(handle: "delivery") {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;