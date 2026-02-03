import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MonthlySpecialsTicker} from '~/components/MonthlySpecialsTicker';
import {HeroSection} from '~/components/hero-section';
import {MonthlySpecials} from '~/components/monthly-specials';
import {PopularProducts} from '~/components/popular-products';
import {CategoryTiles} from '~/components/category-tiles';
import {TrustSection} from '~/components/trust-section';
import {ProductVideoCarousel} from '~/components/product-video-carousel';
import {SiteFooter} from '~/components/site-footer';
import {Reviews} from '~/components/reviews';
import {getPopularProducts} from '~/lib/shopify/pop-products-query';
import {getMonthlySpecials} from '~/lib/shopify/queries';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Valley Feeds | Quality Stock Feed & Farm Supplies'},
    {name: 'description', content: 'Trusted local supplier of stock feed, animal nutrition, and farm supplies.'},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const {storefront} = args.context;

  try {
    const [popularProducts, monthlySpecials] = await Promise.all([
      getPopularProducts(storefront),
      getMonthlySpecials(storefront),
    ]);

    return {popularProducts, monthlySpecials};
  } catch (error) {
    console.error('Loader error:', error);
    return {popularProducts: [], monthlySpecials: []};
  }
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <MonthlySpecialsTicker products={data.monthlySpecials} />
      <main>
        <HeroSection />
        <TrustSection />
        <PopularProducts products={data.popularProducts} />
        <CategoryTiles />
        <MonthlySpecials products={data.monthlySpecials} />
        <ProductVideoCarousel />
        <Reviews />
      </main>
      <SiteFooter />
    </>
  );
}