import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import FriendSuggestionCard from "./cards/FriendSuggestionCard";
import { useQuery } from "@tanstack/react-query";
import { getFriendSuggestionsByUserId } from "../shared/services/users";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import GridLoading from "./loaders/GridLoading";

export default function FriendSuggestions() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
  };

  const {
    data: friendSuggestions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["friend-suggestions"],
    queryFn: async () => getFriendSuggestionsByUserId(loggedInUser!.id),
    enabled: !!loggedInUser,
    // Add staleTime/cacheTime as appropriate for performance/UX
  });

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="min-h-[50vh] text-xl flex justify-center items-center">
        <GridLoading />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching friend suggestions:", error);
    return (
      <div className="w-[750px] mb-5 flex justify-center text-red-500">
        <p>An error occurred while fetching suggestions.</p>
      </div>
    );
  }

  // Ensure friendSuggestions is not undefined/null after loading and error checks
  if (!friendSuggestions || friendSuggestions.length === 0) {
    return null;
  }

  const suggestionCnt = friendSuggestions.length;

  // Case 1: Less than 3 suggestions (don't use Slider, render side-by-side)
  if (suggestionCnt < 3) {
    return (
      <>
        <h1 className="text-2xl font-semibold"> People you may know</h1>
        <div className="w-[750px] mb-5 flex justify-center">
          {/* The original code had an incomplete block here: {friendSuggestion ? } */}
          {friendSuggestions.map((suggestion) => (
            <NavLink
              key={suggestion.user.id}
              to={`/users/${suggestion.user.id}`}
              className="mx-2 block" // mx-2 creates the horizontal margin/gap
            >
              <FriendSuggestionCard suggestion={suggestion} />
            </NavLink>
          ))}
        </div>
      </>
    );
  }

  // Case 2: 3 or more suggestions (use Slider)
  return (
    <>
      <h1 className="text-2xl font-semibold"> People you may know</h1>
      <div className="w-[750px] mb-5">
        <h1 className="text-2xl font-semibold"> People you may know</h1>
        <div className="slider-container">
          <Slider {...settings}>
            {friendSuggestions.map(
              (
                suggestion // Removed 'i' as key, using user.id is better if possible, but 'i' is acceptable if the component requires a div wrapper
              ) => (
                <div key={suggestion.user.id}>
                  <NavLink
                    to={`/users/${suggestion.user.id}`}
                    className="mx-2 block" // mx-2 creates the horizontal margin/gap
                  >
                    <FriendSuggestionCard suggestion={suggestion} />
                  </NavLink>
                </div>
              )
            )}
          </Slider>
        </div>
      </div>
    </>
  );
}
