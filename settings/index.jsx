function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Meyer Objects Settings</Text>}>
      
        <Toggle settingsKey="showTime" label="Show digital time" />
        <Toggle settingsKey="showSeconds" label="Show seconds" />
        <Toggle settingsKey="showDate" label="Show date" />
        <Toggle settingsKey="showDOW" label="Show day of the week" />
        <Toggle settingsKey="showSteps" label="Show step count" />
        
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);