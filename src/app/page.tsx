import Explorer from "@/components/Explorer";
import { peaks } from "@/data/peaks";

export default function Home() {
  return (
    <main>
      <Explorer peaks={peaks} />
    </main>
  );
}
