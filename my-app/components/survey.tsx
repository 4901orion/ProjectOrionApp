// components/Survey.tsx
'use client'
import 'survey-core/survey-core.css';
import { useMemo } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  },
    {
    name: "New Application",
    title: "Starting a new application:",
    type: "radiogroup",
    choices: ["Yes","No"]       
  }]
};

export default function SurveyComponent() {
  const survey = useMemo(() => new Model(surveyJson), [surveyJson]);

    return (
    <div className="survey-form mx-auto w-full max-w-4xl">
        <Survey model={survey} />
    </div>
);
}
