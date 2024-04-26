import React from "react";
import { deepmerge } from "@mui/utils";
import { grey } from "@mui/material/colors";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme } from "@mui/material";

const iOSBoxShadow =
  "0 2px 1px rgba(0,0,0,0.03),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#007AFF",
    },
    secondary: {
      main: "#FF3C30",
    },
    // error: {
    //   main: red.A400,
    // },
    background: {
      default: "#F2F1F3",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "-apple-system San Francisco Helvetica Neue Arial sans-serif",
    h6: {
      fontSize: 16,
    },
    h5: {
      fontSize: 18,
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "400",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 48,
        },
      },
      defaultProps: {
        PaperProps: {
          elevation: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 4,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
          "& h2": {
            lineHeight: "inherit",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        inset: {
          marginLeft: 16,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: 16,
          textTransform: "uppercase",
          lineHeight: "2em",
          backgroundColor: "#F2F1F3",
          paddingTop: 24,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 16,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#3880ff",
          height: 2,
          padding: "15px 0",
        },
        thumb: {
          height: 23,
          width: 23,
          backgroundColor: "#fff",
          boxShadow: iOSBoxShadow,
          marginTop: -10,
          marginLeft: -11,
          "&:focus, &:hover, &$active": {
            boxShadow:
              "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
              boxShadow: iOSBoxShadow,
            },
          },
        },
        active: {},
        valueLabel: {
          left: "calc(-50% + 12px)",
          top: -22,
          "& *": {
            background: "transparent",
            color: "#000",
          },
        },
        track: {
          height: 3,
          borderRadius: 1.5,
          left: "-11px !important",
        },
        rail: {
          height: 3,
          borderRadius: 1.5,
          opacity: 0.5,
          backgroundColor: "#bfbfbf",
          width: "calc(100% + 22px)",
          left: -11,
        },
        mark: {
          backgroundColor: "#bfbfbf",
          height: 8,
          width: 1,
          marginTop: -3,
        },
        markActive: {
          opacity: 1,
          backgroundColor: "currentColor",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 0,
        },
        colorSecondary: {
          padding: 0,
          transform: "translateX(1.5px) translateY(1.5px)",
          "&$checked": {
            transform: "translateX(17px) translateY(1.5px)",
            color: "white",
            "& + $track": {
              backgroundColor: "#34c859",
              opacity: 1,
              border: "none",
            },
          },
          // '&$focusVisible $thumb': {
          //   color: '#52d869',
          //   border: '6px solid #fff',
          // },
        },
        thumb: {
          width: 23,
          height: 23,
        },
        track: {
          borderRadius: 26 / 2,
          backgroundColor: grey[200],
          opacity: 1,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          borderBottom: "1px solid lightgrey",
          justifyContent: "space-between",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle2: {
          fontWeight: 400,
          lineHeight: 1.3,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <RadioButtonUncheckedIcon />,
        checkedIcon: <CheckCircleIcon />,
        color: "primary",
      },
    },
    MuiDrawer: {
      defaultProps: {
        PaperProps: {
          elevation: 0,
        },
      },
    },
  },
});

export const iosTheme = deepmerge(baseTheme, {
  components: {
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.background.paper,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        track: {
          transition: baseTheme.transitions.create([
            "background-color",
            "border",
          ]),
        },
      },
    },
  },
});

export const iosTasksTheme = deepmerge(iosTheme, {});
export const iosCalendarTheme = deepmerge(iosTheme, {});
