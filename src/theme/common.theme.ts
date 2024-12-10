import { createTheme, Theme } from "@mui/material";

export const commonTheme: Theme = createTheme({
  typography: {
    htmlFontSize: 16, // Base font size (optional, but can help with consistency)
    h1: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "21px",
    },
    h2: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    h3: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "12px",
    },
    h4: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "12px",
    },
    h5: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    h6: {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    body1: {
      fontSize: "16px",
    },
    body2: {
      fontSize: "14px",
    },
    // Add other typography variants as needed
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "20px",
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        componentsProps: {
          tooltip: {
            sx: {
              minWidth: "200px",
            },
          },
        },
      },
    },
  },
});
