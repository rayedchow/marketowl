import { getListings } from "./api/listings/route";
import ListingCard from "./components/ListingCard";
import type { Listing } from "./components/ListingCard";

export default async function Home() {
  const listings: Listing[] = await getListings();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketplace Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </main>
  );
}
