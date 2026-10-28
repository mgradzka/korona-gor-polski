import Explorer from "@/components/Explorer";
import { getPeaks } from "@/lib/peaks";

export default async function Home() {
  const peaks = await getPeaks();

  return (
    <main>
      <Explorer peaks={peaks} />
    </main>
  );
}
