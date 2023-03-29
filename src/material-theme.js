import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    palette: {
        primary: {
            main: '#000',
        },
        secondary: {
            main: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderRadius: '1000px',
                    height: '4.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    textTransform: 'none'
                }
            }
        },
    },
});

export default theme;