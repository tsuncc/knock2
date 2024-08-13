import React from 'react'
import { Stepper, Step, StepLabel, Tooltip } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const TwoFactorAuthStepper = ({
  steps,
  activeStep,
  activeColor = '#B99755',
  completedColor = '#B99755',
}) => {
  const theme = createTheme({
    components: {
      MuiStepper: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              color: activeColor,
            },
            '&.Mui-completed': {
              color: completedColor,
            },
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontFamily: 'Noto Serif JP',
          },
        },
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <Tooltip title={step.description} arrow>
              <StepLabel sx={{ fontFamily: 'Noto Serif JP' }}>
                {step.label}
              </StepLabel>
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </ThemeProvider>
  )
}

export default TwoFactorAuthStepper
