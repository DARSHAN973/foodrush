"use client";

import { Star } from "lucide-react";

// StarDisplay — renders filled + empty stars for a given integer rating (1–5).
function StarDisplay({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-100 text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// timeAgo — converts a date to a human-readable relative string.
// A lightweight alternative to importing a date library just for this one use.
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ReviewList — renders a summary header (average + breakdown bars) and
// individual review cards for a restaurant's reviews.
function ReviewList({ reviews, totalCount = 0, restaurantRating }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <p className="text-sm font-medium text-gray-500">No reviews yet.</p>
        <p className="mt-1 text-xs text-gray-400">
          Be the first to share your experience after delivery!
        </p>
      </div>
    );
  }

  // Use the DB-stored restaurantRating for the summary — it reflects ALL reviews
  // (calculated by recalculateRestaurantRating on every submit), not just the 5 we fetched.
  // Fall back to local calculation if restaurantRating is not passed.
  const displayRating =
    restaurantRating !== undefined
      ? Number(restaurantRating).toFixed(1)
      : (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Summary header — overall score + per-star breakdown bars */}
      <div className="flex items-center gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="text-center shrink-0">
          <p className="text-5xl font-bold text-gray-900">{displayRating}</p>
          <div className="mt-1 flex justify-center">
            <StarDisplay rating={Math.round(Number(displayRating))} size={16} />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {totalCount} {totalCount === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="h-16 w-px bg-gray-100 shrink-0" />

        {/* Per-star breakdown bars — 5 down to 1 */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = Math.round((count / reviews.length) * 100);
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right text-gray-500">{star}</span>
                <Star
                  size={10}
                  className="fill-amber-400 text-amber-400 shrink-0"
                />
                <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-5 text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual review cards */}
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            {/* Avatar — first letter of reviewer name, Gmail-style */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
              {review.user.name?.charAt(0).toUpperCase() ?? "?"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {review.user.name}
                </p>
                <span className="shrink-0 text-xs text-gray-400">
                  {timeAgo(review.createdAt)}
                </span>
              </div>

              <div className="mt-0.5">
                <StarDisplay rating={review.rating} />
              </div>

              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}

      {/* Show a note when there are more reviews than what's displayed */}
      {totalCount > reviews.length && (
        <p className="text-center text-sm text-gray-400">
          Showing {reviews.length} of {totalCount} reviews
        </p>
      )}
    </div>
  );
}

export default ReviewList;
