/*  The lack of SSR support may cause hydration errors if a SurveyJS component is pre-rendered on the server. 
To ensure against those errors, use dynamic imports with ssr: false for React components that render SurveyJS components.
*/
"use client";

import dynamic from "next/dynamic";

const SurveyCreatorComponent = dynamic(() => import("@/components/SurveyCreator"), {
  ssr: false
});

export default function SurveyCreatorClient() {
  return <SurveyCreatorComponent />;
}
