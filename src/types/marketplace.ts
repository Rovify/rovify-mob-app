export interface NFTItem {
    id: string;
    tokenId: string;
    contractAddress: string;
    name: string;
    description: string;
    image: string;
    attributes: NFTAttribute[];
    owner: string;
    creator: string;
    price?: number;
    currency?: string;
    isListed: boolean;
    collection: NFTCollection;
    metadata: NFTMetadata;
    createdAt: Date;
}

export interface NFTAttribute {
    trait_type: string;
    value: string | number;
    display_type?: string;
}

export interface NFTCollection {
    id: string;
    name: string;
    description: string;
    image: string;
    contractAddress: string;
    creator: string;
    floorPrice: number;
    totalVolume: number;
    itemCount: number;
    ownerCount: number;
}

export interface NFTMetadata {
    tokenURI: string;
    blockNumber: number;
    txHash: string;
    standard: 'ERC721' | 'ERC1155';
    royalty?: {
        recipient: string;
        percentage: number;
    };
}

export interface MarketplaceListing {
    id: string;
    nftId: string;
    seller: string;
    price: number;
    currency: string;
    startTime: Date;
    endTime?: Date;
    isAuction: boolean;
    highestBid?: MarketplaceBid;
    status: ListingStatus;
    createdAt: Date;
}

export type ListingStatus = 'active' | 'sold' | 'cancelled' | 'expired';

export interface MarketplaceBid {
    id: string;
    listingId: string;
    bidder: string;
    amount: number;
    currency: string;
    timestamp: Date;
    txHash: string;
}

export interface MarketplaceState {
    nfts: Record<string, NFTItem>;
    collections: Record<string, NFTCollection>;
    listings: Record<string, MarketplaceListing>;
    myNFTs: string[];
    myListings: string[];
    isLoading: boolean;
    error: string | null;
    filters: MarketplaceFilters;
}

export interface MarketplaceFilters {
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    collections?: string[];
    status?: ListingStatus[];
    sortBy?: 'price' | 'newest' | 'oldest' | 'ending_soon';
}