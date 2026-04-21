import { Button } from "antd";

export function StepperNavigation({ canPrev, canNext, onPrev, onNext, nextLabel = "Next" }) {
  return (
    <div className="mt-6 flex justify-between">
      <Button onClick={onPrev} disabled={!canPrev}>Previous</Button>
      <Button type="primary" onClick={onNext} disabled={!canNext}>{nextLabel}</Button>
    </div>
  );
}
