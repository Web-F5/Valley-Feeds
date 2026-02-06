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
      
      <div className="prose prose-stone max-w-none prose-headings:text-[#24282E] prose-a:text-[#1E91BA] hover:prose-a:text-[#24282E]">
        <p className="text-lg leading-relaxed mb-6">
          Below is our current delivery areas and days of delivery. Subject to demand we may increase delivery days to some areas. 
          You do not have to be home for the delivery, just leave us delivery instructions and we can unload it ready for you to come home to. 
          If you're outside our delivery area and would like to use our services we can expand our delivery service area if there is enough demand, 
          just shoot us a message and we will do what we can. Please note ideally we like orders to be in by the Sunday night before delivery to your area.
        </p>
        
        <p className="text-lg leading-relaxed mb-8">
          Delivery days may change slightly but we will always contact you and let you know if they are varying. 
          Please follow our Facebook page for regular updates.
        </p>

        {/* Delivery Map Image - you'll need to add this image to your public folder */}
        <div className="my-8">
          <img 
            src="/images/delivery-map.jpg" 
            alt="Valley Feeds Delivery Areas" 
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        <h2 className="text-2xl font-bold text-[#24282E] mt-12 mb-6">Delivery Schedule</h2>
        <p className="text-lg mb-6">
          Please see our delivery schedule breakdown below. Please note the additional information on some areas.
        </p>

        <div className="bg-stone-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#24282E] mb-4">Local Area One (Every Thursday*)</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-none pl-0">
            <li>Shepparton</li>
            <li>Mooroopna</li>
            <li>Kialla</li>
            <li>Congupna</li>
            <li>Tallygaroopna</li>
            <li>Lemnos</li>
            <li>Invergordon</li>
            <li>Katandra</li>
          </ul>
        </div>

        <div className="bg-stone-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-[#24282E] mb-4">Local Area Two (Every Friday*)</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-none pl-0">
            <li>Numurkah</li>
            <li>Katunga</li>
            <li>Invergordon</li>
            <li>Katandra</li>
            <li>Cobram</li>
            <li>Barooga</li>
            <li>Yarroweyah</li>
            <li>Wunghnu</li>
            <li>Koonoomoo</li>
            <li>Boosey</li>
            <li>Yabba</li>
            <li>Katamatite</li>
            <li>Muckatah</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Notes</h4>
          <p className="text-yellow-800">
            *Delivery day to local areas may vary and delivery may be on an earlier day. 
            We will always notify you in advance and check suitability.
          </p>
        </div>
      </div>
    </div>
  );
}

const DELIVERY_PAGE_QUERY = `#graphql
  query DeliveryPage {
    page(handle: "delivery") {
      id
      title
      seo {
        description
        title
      }
    }
  }
`;