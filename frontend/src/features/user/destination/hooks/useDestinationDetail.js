import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import destinationApi from "../destinationApi";
import tourApi from "../../tour/tourApi";

export const useDestinationDetail = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [tours, setTours] = useState([]);
  const [selectedTourIndex, setSelectedTourIndex] = useState(0);
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [relatedList, setRelatedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("itinerary");
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDetail = async () => {
      setIsLoading(true);
      try {
        let currentDest = null;
        try {
          const res = await destinationApi.getByIdOrSlug(idOrSlug);
          currentDest = res.data || res;
        } catch (err) {
          console.error("Failed to load destination by ID/slug:", err);
        }

        setDestination(currentDest);

        if (currentDest) {
          // Fetch Tours for this destination
          try {
            const tourRes = await tourApi.getByDestination(currentDest._id);
            const tourItems = Array.isArray(tourRes)
              ? tourRes
              : tourRes.items || [];
            setTours(tourItems);
            if (tourItems.length > 0) {
              setSelectedTourIndex(0);
              if (
                tourItems[0].departureDates &&
                tourItems[0].departureDates.length > 0
              ) {
                setSelectedDate(tourItems[0].departureDates[0]);
              }
            }
          } catch {
            setTours([]);
          }

          // Related destinations
          if (
            currentDest.relatedDestinations &&
            currentDest.relatedDestinations.length > 0
          ) {
            const fullRelated = currentDest.relatedDestinations.map((rel) => {
              if (typeof rel === "object" && rel.name) return rel;
              return { _id: rel, name: "Điểm đến liên quan" };
            });
            setRelatedList(fullRelated);
          } else if (currentDest.region) {
            try {
              const relRes = await destinationApi.getAll({
                region: currentDest.region,
              });
              const relItems =
                relRes.items || (Array.isArray(relRes) ? relRes : []);
              setRelatedList(
                relItems.filter((d) => d._id !== currentDest._id).slice(0, 3)
              );
            } catch {
              setRelatedList([]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load destination details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [idOrSlug]);

  const activeTour = tours[selectedTourIndex] || null;
  const activeDurationOption =
    activeTour?.durationOptions?.[selectedDurationIdx] ||
    activeTour?.durationOptions?.[0] ||
    null;
  const activeTourPrice =
    activeDurationOption?.price ?? (activeTour?.price || 0);

  // Whenever user switches active tour, sync departure date & reset duration option
  const handleSelectTour = (index) => {
    setSelectedTourIndex(index);
    setSelectedDurationIdx(0);
    const tour = tours[index];
    if (tour?.departureDates && tour.departureDates.length > 0) {
      setSelectedDate(tour.departureDates[0]);
    } else {
      setSelectedDate("");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToBooking = () => {
    if (!activeTour) return;
    const tourId = activeTour.slug || activeTour._id || activeTour.id;
    const queryParams = new URLSearchParams();
    if (selectedDate) queryParams.set("date", selectedDate);
    if (selectedDurationIdx > 0) queryParams.set("duration", selectedDurationIdx);
    if (adultsCount > 1) queryParams.set("adults", adultsCount);
    if (childrenCount > 0) queryParams.set("children", childrenCount);
    const url = `/tour-booking/${tourId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    navigate(url);
  };

  const galleryItems = destination?.gallery || [];
  const activePhoto =
    lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const items = destination?.gallery || [];
    if (items.length === 0) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((p) => (p + 1) % items.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((p) => (p - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, destination]);

  // Calculate estimated subtotal in sticky card
  const estimatedTotal = activeTourPrice
    ? adultsCount * activeTourPrice +
      childrenCount * Math.round(activeTourPrice * 0.75)
    : 0;

  return {
    destination,
    tours,
    selectedTourIndex,
    selectedDurationIdx,
    setSelectedDurationIdx,
    selectedDate,
    setSelectedDate,
    adultsCount,
    setAdultsCount,
    childrenCount,
    setChildrenCount,
    relatedList,
    isLoading,
    copied,
    activeSection,
    setActiveSection,
    lightboxIndex,
    setLightboxIndex,
    activeTour,
    activeDurationOption,
    activeTourPrice,
    galleryItems,
    activePhoto,
    estimatedTotal,
    handleSelectTour,
    handleShare,
    handleProceedToBooking,
    navigate,
  };
};

export default useDestinationDetail;

