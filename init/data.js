const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry: { type: "Point", coordinates: [-118.7798, 34.0259] },
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry: { type: "Point", coordinates: [-106.837, 39.1911] },
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry: { type: "Point", coordinates: [11.2558, 43.7696] },
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    geometry: { type: "Point", coordinates: [-122.6765, 45.5231] },
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    geometry: { type: "Point", coordinates: [-86.8515, 21.1619] },
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    geometry: { type: "Point", coordinates: [34.6857, -2.3333] },
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?auto=format&fit=crop&w=800&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    geometry: { type: "Point", coordinates: [178.065, -17.7134] },
  },
  {
    title: "Modern Apartment in Tokyo",
    description:
      "Explore the vibrant city of Tokyo from this modern apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    geometry: { type: "Point", coordinates: [139.6917, 35.6895] },
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    geometry: { type: "Point", coordinates: [73.2207, 3.2028] },
  },
];

module.exports = { data: sampleListings };
