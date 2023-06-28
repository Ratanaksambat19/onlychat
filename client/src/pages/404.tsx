import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../assets/images/logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '300px', // Adjust the width as per your preference
    height: '300px', // Adjust the height as per your preference
    marginBottom: theme.spacing(4),
    paddingRight: '30px',
  },
  text: {
    marginBottom: theme.spacing(2),
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction='column' alignItems='center'>
        <Grid item>
          <img src={Logo} alt='Logo' className={classes.logo} />
        </Grid>
        <Grid item>
          <Typography variant='h4' className={classes.text}>
            404 Page Not Found!
          </Typography>
          <Typography variant='body1' className={classes.text}>
            This group chat might be deleted or even not existed.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFoundPage;
