// Helper to format currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Generates stable random ratings & reviews based on product ID
export const getMockReviews = (productId) => {
  const reviewerNames = [
    'Alexander Wright',
    'Sophia Martinez',
    'Marcus Vance',
    'Emily Lawson',
    'David K.',
    'Sarah Chen',
    'Liam O\'Connor',
    'Olivia Taylor'
  ];

  const reviewComments = [
    'Absolutely love this item! Quality is top-notch and looks exactly like the photos.',
    'Very solid purchase. Shipping took a couple of days extra, but customer service was extremely helpful.',
    'Exceeded my expectations. The finish is premium, and it functions perfectly.',
    'Decent product for the price. Not extraordinary, but does the job well.',
    'Will definitely buy this again. It has quickly become an essential part of my daily routine.',
    'The build quality is outstanding. Feels very premium and durable.',
    'Highly recommended! Worth every single penny.',
    'Slightly smaller than expected, but the build quality and design are excellent!'
  ];

  // Use a simple hashing function of productId to generate deterministic mock reviews
  const reviewsCount = (productId % 3) + 2; // 2 to 4 reviews
  const reviews = [];

  for (let i = 0; i < reviewsCount; i++) {
    const reviewerIndex = (productId + i) % reviewerNames.length;
    const commentIndex = (productId * (i + 1)) % reviewComments.length;
    const rating = 4 + ((productId + i) % 2); // 4 or 5 stars
    
    // Generate a deterministic date (e.g. some days ago)
    const daysAgo = (productId * (i + 2)) % 25 + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    reviews.push({
      id: `${productId}-review-${i}`,
      name: reviewerNames[reviewerIndex],
      rating,
      comment: reviewComments[commentIndex],
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    });
  }

  return reviews;
};
