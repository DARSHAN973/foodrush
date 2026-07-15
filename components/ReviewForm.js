"use client";

import { useState, useTransition } from "react";
import { Star, SendHorizonal } from "lucide-react";
import { createReviewAction } from "@/app/actions/reviewActions";

// ReviewForm — Client Component for submitting a restaurant review.
// Only rendered by the Server Component when it confirms the current user
// has a DELIVERED order for this restaurant and has not yet reviewed it.
function ReviewForm({ restaurantId, orderId }) {
  const [rating, setRating] = useState(0);
  // hovered tracks which star the mouse is over — used to preview the selection.
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // useTransition — lets us call a server action asynchronously from a client
  // event handler while tracking its pending state. isPending is true while
  // the action is running, so we can disable the form and show a loading state.
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }

    setError(null);

    const formData = new FormData(e.target);
    // The star UI controls the rating value — inject it into FormData manually
    // since we're not using a real <input type="number"> for the star clicks.
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = await createReviewAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  };

  // Success state — shown after the review is created successfully.
  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Star className="fill-green-500 text-green-500" size={22} />
        </div>
        <h3 className="font-semibold text-green-800">
          Thanks for your review!
        </h3>
        <p className="mt-1 text-sm text-green-600">
          Your feedback helps other customers discover great food.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-6">
      <h3 className="mb-1 text-base font-semibold text-gray-900">
        Leave a Review
      </h3>
      <p className="mb-5 text-sm text-gray-500">
        You&apos;ve ordered from this restaurant. How was your experience?
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hidden fields — server action reads restaurantId + orderId from FormData
            to link the new review to the correct restaurant and delivery proof. */}
        <input type="hidden" name="restaurantId" value={restaurantId} />
        <input type="hidden" name="orderId" value={orderId} />

        {/* Star Rating — clicking a star sets the permanent rating state.
            Hovering previews the rating without committing it. */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={32}
                  className={
                    // Show filled star for all positions up to hovered or selected rating.
                    // hovered takes priority when mouse is over the stars.
                    (hovered || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment textarea — optional, maps to the comment field in ReviewCreate */}
        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Comment{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            name="comment"
            rows={3}
            placeholder="What did you enjoy? Any suggestions?"
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizonal size={15} />
          {isPending ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
