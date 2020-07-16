import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgba(9, 244, 200, 1)'
        },
        // secondary: {
        //     main: green[500],
        // },
    },
});

const Loader = ({size = '4rem'}) => (
    <ThemeProvider theme={theme}>
        <CircularProgress  size={size} color="primary"/>
    </ThemeProvider>
);

export default Loader;