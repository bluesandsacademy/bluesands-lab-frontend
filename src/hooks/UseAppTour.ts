import { tours } from "@/lib/tourConfig";
import { useTour } from "@reactour/tour";

export function UseAppTour() {
  const { setIsOpen, setSteps } = useTour();

  const startTour = (tourName: keyof typeof tours) => {
    const steps = tours[tourName];

    if (!steps) {
      return;
    }

    if (setSteps) {
      setSteps(steps);
    }

    setIsOpen(true);
  };
  return { startTour };
}
