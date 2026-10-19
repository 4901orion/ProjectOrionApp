import React from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n";
import "survey-creator-core/survey-creator-core.i18n";
import SurveyTheme from "survey-core/themes";
import { UIPreset, registerSurveyTheme } from "survey-creator-core";
import { Advanced } from "survey-creator-core/ui-presets";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "./global.css"; // Import your global CSS file

import { registerCreatorTheme } from "survey-creator-core";

registerCreatorTheme(SurveyTheme); // Add predefined Survey Creator UI themes

registerSurveyTheme(SurveyTheme); // Add predefined survey themes for the Themes tab
function SurveyCreatorRenderComponent() {
    const creator = new SurveyCreator();
    // Apply the Advanced UI preset
    const advancedPreset = new UIPreset(Advanced);
    advancedPreset.applyTo(creator);
    return (<SurveyCreatorComponent creator={creator} />);
}

export default SurveyCreatorRenderComponent;