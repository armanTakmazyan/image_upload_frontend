import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BlurLog } from './blur-log';
import { ResizeLog } from './resize-log';
import { CropLog } from './crop-log';
import Paper from '@material-ui/core/Paper';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router';
import _ from 'lodash';

const useStyles = makeStyles({
  wrapper: {
    height: '100%',
    padding: 16,
  },
  itemWrapper: {
    marginTop: 16,
  },
  imgWrapper: {
    position: 'relative',
    maxWidth: 400,
    height: 200
  },
  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    objectFit: 'contain'
  }
});

export const ImageLogs = (
  {
    image,
    actions,
  }
) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <IconButton onClick={() => history.push('/')}>
        <ArrowBackIcon />
      </IconButton>
      <h1>Image logs</h1>
      <div className={classes.imgWrapper}>
        <img className={classes.img} src={`${process.env.REACT_APP_SERVER_URL}/${image.path}`} alt='Not Found' />
      </div>
      {
        _.defaultTo(actions, []).map(({ actions: action }, idx) => (
          <Paper className={classes.itemWrapper} key={idx}>
            <CropLog data={action.crop} />
            <ResizeLog data={action.resize} />
            <BlurLog data={action.blur} />
          </Paper>
        ))
      }
    </div>
  );
};

ImageLogs.defaultProps = {
  actions: {},
};

ImageLogs.propsTypes = {
  actions: PropTypes.object,
};