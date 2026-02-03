import type {Route} from './+types/store';
import {HeroSectionKatandraWest} from '~/components/hero-section-katandrawest';
import {GloriaFoodsHero} from '~/components/Gloria-foods-hero';
import {SchoolLunches} from '~/components/School-lunches';
import {SiteFooter} from '~/components/site-footer';
import {KatandraWestPostOffice} from '~/components/KatandraWestPostOffice';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Katandra West General Store'},
    {name: 'description', content: 'Visit our local store for stockfeed, post office services, takeaway food and school lunches.'},
  ];
};

export default function StorePage() {
  return (
    <>
      <HeroSectionKatandraWest />
      <GloriaFoodsHero />
      <SchoolLunches />
      <KatandraWestPostOffice />
      <SiteFooter />
    </>
  );
}