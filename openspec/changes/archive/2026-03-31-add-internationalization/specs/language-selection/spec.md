## ADDED Requirements

### Requirement: Users MUST be able to switch between English and Traditional Chinese
The system SHALL provide an explicit language selection control in the application shell. Users MUST be able to switch between `en` and `zh-TW`, and the visible UI copy SHALL update immediately after selection.

#### Scenario: Switch to Traditional Chinese
- **WHEN** the user selects `zh-TW` from the language control
- **THEN** the application updates product-owned UI copy to Traditional Chinese in the current session

#### Scenario: Switch back to English
- **WHEN** the user selects `en` from the language control
- **THEN** the application updates product-owned UI copy to English in the current session

### Requirement: Locale preference MUST persist across reloads
The system SHALL persist the selected locale as a user preference on the client and reuse it on subsequent visits. If no saved preference exists, the system SHALL use the default locale.

#### Scenario: Reopen with saved Chinese preference
- **WHEN** a user previously selected `zh-TW` and opens or reloads the app again
- **THEN** the application restores `zh-TW` before rendering localized UI copy for the session

#### Scenario: First visit with no saved locale
- **WHEN** the user opens the app for the first time and no saved locale preference exists
- **THEN** the application uses the default locale

### Requirement: Active locale MUST drive document language metadata
The system SHALL keep the runtime document language metadata aligned with the active locale so assistive technology can interpret the page correctly.

#### Scenario: Update HTML language attribute
- **WHEN** the active locale changes
- **THEN** the application updates the document `lang` value to the matching locale code
