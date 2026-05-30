import { ResultView } from "@/components/truedeal/result-view";

export default function ResultPage({ params }: { params: { id: string } }) {
  return <ResultView id={params.id} />;
}
