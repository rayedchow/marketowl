import Image from "next/image";

export interface Listing {
  id: string;
  listing_price: {
    formatted_amount: string;
  };
  marketplace_listing_title: string;
  location: {
    city: string;
    state: string;
  };
  primary_listing_photo: {
    photo_image_url: string;
  };
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={
            listing.primary_listing_photo?.photo_image_url || "/placeholder.jpg"
          }
          alt={listing.marketplace_listing_title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {listing.marketplace_listing_title}
        </h3>
        <p className="text-xl font-bold text-green-600 mb-2">
          {listing.listing_price?.formatted_amount}
        </p>
        <p className="text-gray-600">
          {listing.location?.city}, {listing.location?.state}
        </p>
      </div>
    </div>
  );
}
