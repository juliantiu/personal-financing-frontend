import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  detailPanel: {
    padding: theme.spacing(2)
  },
  contentWindowContainer: {
    padding: theme.spacing(2),
  },
  bottomAppBar: {
    backgroundColor: 'transparent',
    top: 'auto',
    bottom: 0,
    boxShadow: 'none'
  },
  yearSelectorAppBar: {
    backgroundColor: '#FFF',
    color: 'rgba(0, 0, 0, 0.54)',
    boxShadow: 'none',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    backgroundColor: '#FFF',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    // hides the menuButton when the screen is in mobile view
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1
  },
}));

export default useStyles;