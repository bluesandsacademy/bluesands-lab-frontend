import { useEffect, useState } from "react";
import type { CallBackProps, Step } from "react-joyride";
import Joyride, { EVENTS, STATUS } from "react-joyride";

interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

interface TourGuideProps {
  start: boolean;
  setStartTour: (value: boolean) => void;
  onTourEnd: () => void;
}

const TeacherTourGuide = ({
  start,
  setStartTour,
  onTourEnd,
}: TourGuideProps) => {
  const [progress, setProgress] = useState<number>(1);
  const totalSteps: number = 3;
  const generateSteps = (val: number): Step[] => [
    {
        content: (
            <div className="p-3">
                <p className="text-4xl">Learn this</p>
            </div>
        ),
        locale: {
            skip: <strong aria-label="skip">Skip</strong>
        },
        target: "body"
    }
  ];
  const [{ run, steps }, setState] = useState<State>({
    run: start,
    stepIndex: 0,
    steps: generateSteps(progress),
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: generateSteps(progress),
    }));
  }, [progress]);

  useEffect(() => {
    if (start) {
      setState((prevState) => ({
        ...prevState,
        run: true,
        stepIndex: 0,
      }));
    }
  }, [start]);

  const handleJoyrideCallback = (data: CallBackProps) => {};
  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      run={run}
      steps={steps}
      scrollToFirstStep
      debug
    />
  );
};

export default TeacherTourGuide;
