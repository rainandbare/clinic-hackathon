import WizardProvider from "@/components/wizard/WizardProvider";
import Wizard from "@/components/wizard/Wizard";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-cl-page-bg">
      <WizardProvider>
        <Wizard />
      </WizardProvider>
    </main>
  );
}
