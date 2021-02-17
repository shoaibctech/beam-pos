import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ff1375'
        },
        secondary: {
            main: 'rgba(255, 255, 255, 100)',
        },
    },
});

const Loader = ({size = '4rem', color = 'primary'}) => (
    <ThemeProvider theme={theme}>
        <CircularProgress  size={size} color={color}/>
    </ThemeProvider>
);

export default Loader;