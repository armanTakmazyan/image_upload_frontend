import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export const ResizeLog = ({data}) => {
  const classes = useStyles();
  return (
    <div>
      {_.isEmpty(data) ? (
        <Card className={classes.root}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Resize log
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                No resize effect are used
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
        <Card className={classes.root}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                Resize log
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Width: {data.width}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Height: {data.height}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </div>
  );
};
