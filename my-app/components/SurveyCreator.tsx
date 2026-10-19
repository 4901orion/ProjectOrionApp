'use client';

// components/SurveyCreator.tsx
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

import { ICreatorOptions } from "survey-creator-core";
import { SurveyCreatorComponent } from "survey-creator-react";

//specified surveycretor properties in configuration object to be passed to the SurveyCreator constructor
const defaultCreatorOptions: ICreatorOptions = {
  autoSaveEnabled: true,
  collapseOnDrag: true
};

//configuration object passed to the SurveyCreator constructor to instantiate Survey Creator
import { useState } from "react";
import { SurveyCreator } from "survey-creator-react";

export default function SurveyCreatorWidget(props: { json?: Object, options?: ICreatorOptions }) {
  let [creator, setCreator] = useState<SurveyCreator>();
  
  if (!creator) {
    creator = new SurveyCreator(props.options || defaultCreatorOptions);
    setCreator(creator);
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
