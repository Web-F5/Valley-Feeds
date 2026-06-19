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
        className="prose prose-lg prose-stone max-w-none
          prose-headings:text-[#24282E] prose-headings:font-bold
          prose-h2:text-2xl prose-h3:text-xl
          prose-a:text-[#1E91BA] hover:prose-a:text-[#24282E]
          prose-table:w-full prose-thead:bg-[#24282E] prose-thead:text-white
          prose-th:px-4 prose-th:py-3 prose-th:font-semibold
          prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-stone-200
          prose-img:rounded-lg prose-img:shadow-lg
          prose-ul:pl-5 prose-li:my-1"
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