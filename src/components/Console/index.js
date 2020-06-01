import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import YearSelector from './YearSelector';
import MonthSelector from './MonthSelector';
import ContentWindow from './ContentWindow';

import useStyles from '../../hooks/useStyles';

import { TransactionHistoryProvider } from '../../contexts/TransactionHistoryState';
import { BudgetProvider } from '../../contexts/BudgetState';
import { CategoriesProvider } from '../../contexts/CategoriesState';
import { SubcategoriesProvider } from '../../contexts/SubcategoriesState';

import hamburger from '../../assets/img/interface.png';
import '../../assets/css/globalstyles.css';

const currentYear = new Date(Date.now()).getFullYear();
const currentMonth = new Date(Date.now()).getMonth();

function Console() {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  // Start: Provided by Material-ui example
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <div>
      <div className={`${classes.toolbar} app-title-container`}>
        <Typography variant="h5">Personal Financing</Typography>
        <Typography variant="body1">v1.0.0</Typography>
      </div>
      <Divider />
      <MonthSelector month={month} setMonth={setMonth} />
    </div>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // End: Provided by Material-ui example

  // Most of these components are provided by Material-ui example
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <img src={hamburger} height={25} width={25} alt="menu icon"/>
          </IconButton>
          <YearSelector year={year} setYear={setYear}/>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="months">
        {/* Component is hidden when the screen size is > 'sm' */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/* Component is hidden when the screen size is < 'sm' */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <BudgetProvider>
        <CategoriesProvider>
        <SubcategoriesProvider>
        <TransactionHistoryProvider>
          <ContentWindow month={month} year={year} />
        </TransactionHistoryProvider>
        </SubcategoriesProvider>
        </CategoriesProvider>
        </BudgetProvider>
      </main>
    </div>
  );
}

export default Console;