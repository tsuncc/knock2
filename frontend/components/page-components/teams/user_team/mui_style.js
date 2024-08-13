import { styled } from '@mui/material/styles'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiTypography from '@mui/material/Typography'

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  background: `#333333`,
  color: `#B99755`,
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  () => ({
    // '& .MuiAccordionSummary-content': {
    //   margin: '0 auto',
    //   fontSize: '22px',
    //   textAlign: 'center',
    // },
    '& .MuiTypography-body1': {
      fontFamily: 'Noto Serif JP, serif',
      textAlign: 'center',
      margin: '0 auto',
      fontSize: '22px',
    },
  })
)

const AccordionDetails = styled(MuiAccordionDetails)({})

const Typography = styled((props) => <MuiTypography {...props} />)(() => ({
  // '& .MuiTypography-body1': {
  //   textAlign: 'center',
  //   margin: '0 auto',
  //   fontSize: '22px',
  // },
  '& a': {
    color: '#FFF',
  },
}))

export { Accordion, AccordionSummary, AccordionDetails, Typography }
