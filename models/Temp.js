const agg = [
  {
    $match: {
      product: new ObjectId('64918b3fb040837b349796ab'),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
