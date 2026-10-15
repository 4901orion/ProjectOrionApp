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
  }]
};

export default function SurveyComponent() {
  const survey = useMemo(() => new Model(surveyJson), [surveyJson]);

return <Survey model={survey} />;}
