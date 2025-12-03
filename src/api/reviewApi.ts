import { addReview, listReviews, resetReviews } from "../data/reviewRepository";
import { Review, ReviewPayload } from "../models/review.model";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchParams {
  page: number;
  limit: number;
  bookId?: number;
}

interface FetchResult {
  items: Review[];
  hasMore: boolean;
  nextPage: number | null;
}

export const fetchReviewFeed = async ({ page, limit, bookId }: FetchParams): Promise<FetchResult> => {
  await delay(300);
  return listReviews(page, limit, bookId);
};

export const submitReview = async (payload: ReviewPayload): Promise<Review> => {
  await delay(350);
  return addReview(payload);
};

export const restartMockServer = async () => {
  await delay(150);
  resetReviews();
};
