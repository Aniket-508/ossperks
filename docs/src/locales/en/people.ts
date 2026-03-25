const people = {
  associatedWith: "Associated with",
  backToPeople: "Back to people",
  description:
    "operators/contacts behind the programs that support open-source projects.",
  detail: {
    about: "About",
    noPrograms: "No associated programs found.",
  },
  empty:
    "No program contacts have been added yet. Add a contact to program data to see them here.",
  heading: "People",
  roleAt: "{role} at {provider}",
  submit: {
    autofill: {
      button: "Autofill",
      description:
        "Simply input the profile URL, and we'll automagically fill in the details for you!",
      error:
        "Could not extract details from this URL. Please fill in the form manually.",
      heading: "Autofill with AI",
      loading: "Autofilling...",
      placeholder: "https://...",
    },
    buttonText: "Submit a contact",
    description:
      "Know someone behind a program? Submit their details and we'll add them.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "e.g., Jane Doe",
      programLabel: "Program",
      programPlaceholder: "Select a program",
      roleLabel: "Role",
      rolePlaceholder: "e.g., OSS Program Manager",
      urlLabel: "URL (optional)",
      urlPlaceholder: "https://...",
    },
    heading: "Submit a contact",
    submitButton: "Submit PR",
    submitError: "Failed to submit",
    submitting: "Submitting...",
    success: {
      close: "Close",
      heading: "PR Created!",
      message: "Your pull request has been created and will be reviewed.",
      viewPr: "View PR #{prNumber}",
    },
    validation: {
      invalidUrl: "Must be a valid URL",
      nameRequired: "Name is required",
      programRequired: "Program is required",
      roleRequired: "Role is required",
    },
  },
};

export default people;
export type PeopleTranslations = typeof people;
