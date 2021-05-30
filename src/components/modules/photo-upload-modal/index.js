import { useState, useRef } from 'react';
import { Modal, Fade, Grid, Slider, makeStyles, CircularProgress } from '@material-ui/core';
import ReactCrop from 'react-image-crop';
import { useResizeDetector } from 'react-resize-detector';
import Stepper from './stepper';

const useStyles = makeStyles((theme) => ({
  cropButton: {
    zIndex: 9999,
    position: 'fixed',
    right: 15,
    bottom: 15
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    width: '100%',
    maxWidth: '600px',
    minHeight: '400px',
    margin: 12,
    position: 'relative'
  },
  wrapper: {
    width: '100%',
    maxWidth: '600px',
    minHeight: '400px',
    maxHeight: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& *': {
      maxHeight: '400px',
      maxWidth: '100%',
    },
  },
  resizedImageBlok: {
    resize: 'both',
    '& img': {
      width: '100%',
      height: '100%',
      display: 'block'
    },
    "&::-webkit-scrollbar": {
      width: 0,
      height: 0
    }
  },
  footer: {
    background: 'white',
    padding: 8
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10'
  }
}));

const PhotoUploadModal = ({
  open,
  onClose,
  image,
  loading,
  onUpload
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 60,
    height: 60
  });
  const { ref: resizeBlokRef, width: resizeBlokWidth, height: resizeBlokHeight } = useResizeDetector();
  const [imgInfo, setImgInfo] = useState({});
  const [croppedImage, setCroppedImage] = useState({ path: null });
  const imageRef = useRef(null);
  const [resultInfo, setResultInfo] = useState({});

  const getCroppedImg = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/png");
  }

  const makeClientCrop = async () => {
    if (imageRef.current && crop.width && crop.height) {
      const res = await getCroppedImg(
        imageRef.current,
        crop,
        'newFile.jpeg'
      );

      setCroppedImage({
        path: res
      });
    }
  }

  const onHandleSkipCrop = async () => {
    setCroppedImage({
      path: image
    });
  }

  const onHandleCrop = async () => {
    if (crop.width === 0 || crop.height === 0) {
      onHandleSkipCrop();
    } else {
      const info = {
        left: crop.x * imgInfo.widthRatio,
        top: crop.y * imgInfo.heightRatio,
        width: crop.width * imgInfo.widthRatio,
        height: crop.height * imgInfo.heightRatio,
      };

      setResultInfo(prev => ({
        ...prev,
        crop: info
      }));

      await makeClientCrop();
    }
  }



  const onHandleResize = () => {
    if (resultInfo.crop) {
      const { crop: {
        width: croppedWidth,
        height: croppedHeight
      } } = resultInfo;

      setResultInfo(prev => ({
        ...prev,
        resize: {
          width: (croppedWidth / croppedImage.clientWidth) * resizeBlokWidth,
          height: (croppedHeight / croppedImage.clientHeight) * resizeBlokHeight,
        }
      }));
    } else {
      setResultInfo(prev => ({
        ...prev,
        resize: {
          width: (imgInfo.naturalWidth / croppedImage.clientWidth) * resizeBlokWidth,
          height: (imgInfo.naturalHeight / croppedImage.clientHeight) * resizeBlokHeight,
        }
      }));
    }
  }


  const onHandleBlur = () => {
    onUpload(resultInfo, image);
  }

  return <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    className={classes.modal}
    open={open}
    onClose={onClose}
    disableBackdropClick={loading}
    closeAfterTransition
  >
    <Fade in={open}>
      <div className={classes.paper}>
        {
          loading && <div className={classes.loading}><CircularProgress /></div>
        }
        <div className={classes.wrapper}>
          {activeStep === 0 &&
            <ReactCrop
              src={image}
              crop={crop}
              onChange={newCrop => setCrop(newCrop)}
              onImageLoaded={(img) => {
                if (img) {
                  imageRef.current = img;
                  setImgInfo({
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    widthRatio: img.naturalWidth / img.width,
                    heightRatio: img.naturalHeight / img.height
                  });
                }
              }}
            />
          }
          <div
            className={classes.resizedImageBlok}
            ref={resizeBlokRef}
            style={{
              overflow: activeStep === 2 ? 'hidden' : 'auto',
              resize: activeStep === 2 ? 'none' : 'both'
            }}
          >
            {(activeStep === 1 || activeStep === 2) && <img
              src={croppedImage.path}
              style={{
                filter: resultInfo.blur && `blur(${resultInfo.blur.percent / 2 || 0}px)`
              }}
              alt=''
              onLoad={(e) => {
                setCroppedImage(prev => ({
                  ...prev,
                  clientWidth: e.target.width,
                  clientHeight: e.target.height
                }))
              }}
            />}
          </div>
        </div>
        <div className={classes.footer}>
          {
            activeStep === 2 && <Grid container spacing={2} alignItems='center'>
              <Grid item>0</Grid>
              <Grid item xs>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={resultInfo.blur?.percent || 0}
                  onChange={(e, value) => {
                    setResultInfo(prev => ({
                      ...prev,
                      blur: {
                        percent: value
                      }
                    }))
                  }} aria-labelledby="continuous-slider" />
              </Grid>
              <Grid item>10</Grid>
            </Grid>
          }
          <Stepper
            onHandleCrop={onHandleCrop}
            onHandleResize={onHandleResize}
            onHandleSkipCrop={onHandleSkipCrop}
            onHandleSkipResize={onHandleResize}
            onHandleBlur={onHandleBlur}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </div>
      </div>
    </Fade>
  </Modal>
}

export default PhotoUploadModal;