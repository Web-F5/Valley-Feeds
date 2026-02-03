import { getMonthlySpecials } from "~/lib/shopify/queries"
import MonthlySpecialsTickerClient from "./MonthlySpecialsTickerClient"
import { storefrontRedirect } from "@shopify/hydrogen";

export function MonthlySpecialsTicker({ products }: { products: any[] }) {
  return <MonthlySpecialsTickerClient products={products} />
}
