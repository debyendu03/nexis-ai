export const clerkCustomAppearance = {
  variables: {
    colorPrimary: "!var(--accent)",
    colorBackground: "var(--bg-surface)",
    colorBorder: "var(--border)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-secondary)",
    colorDanger: "var(--danger)",
    colorSuccess: "var(--success)",
  },

  elements: {
    card: {
      backgroundColor: "var(--bg-surface)",
      borderRadius: "0",
      boxShadow: "none",
      border: "1px solid var(--border)",
    },

    // GOOGLE BUTTON
    socialButtonsBlockButton: {
      boxShadow: "0 0 0 1px var(--border) !important",
      color: "var(--text-primary)",
      backgroundColor: "var(--bg-elevated)",
      "&:hover": {
        backgroundColor: "var(--bg-elevated)",
        boxShadow: "0 0 2px 1px var(--accent) !important",
      },
    },

    // INPUT
    formFieldInput: {
      boxShadow: "0 0 0 1px var(--border) !important",
      color: "var(--text-primary)",
      backgroundColor: "var(--bg-elevated)",

      "&:hover": {
        boxShadow: "0 0 4px 1px var(--accent) !important",
      },
      "&:focus": {
        boxShadow: "0 0 4px 1px var(--accent) !important",
      },
    },

   // SHOW PASSWORD BUTTON
    formFieldInputShowPasswordButton: {
      transition: "color 0.15s ease",
      color: "var(--text-secondary)",
      "&:hover": {
        color: "var(--accent)",
      },
    },

    
    formButtonPrimary: {
      border: "2px solid red",
      backgroundColor: "var(--accent)",
      "&:hover": {
        backgroundColor: "var(--accent-hover)",
      },
    },

    // DIVIDER LINE
    dividerLine: {
      backgroundColor: "var(--border)",
    },
      
    formFieldAction: {
      color: "var(--text-primary)",
      transition: "color 0.15s ease",
    },

    footerActionLink: {
      color: "var(--accent)",
      "&:hover": {
        color: "var(--accent-hover)",
      },
    },
  },
};
