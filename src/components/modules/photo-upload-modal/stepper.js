import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

function getSteps() {
  return ['Crop image', 'Resize image', 'Blur image'];
}

const StepperSection = ({
  onHandleCrop,
  onHandleSkipCrop,
  onHandleResize,
  onHandleSkipResize,
  onHandleBlur,
  activeStep,
  setActiveStep
}) => {
  const classes = useStyles();
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    return step !== 2;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onHandleBlur();
      return;
    }
    if (activeStep === 0) {
      onHandleCrop();
    } else if (activeStep === 1) {
      onHandleResize();
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    if (activeStep === 0) {
      onHandleSkipCrop();
    } else if (activeStep === 1) {
      onHandleSkipResize();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };


  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.footer}>
        {isStepOptional(activeStep) && (
          <Button
            variant='contained'
            color='primary'
            onClick={handleSkip}
            className={classes.button}
          >
            Skip
          </Button>
        )}

        <Button
          variant='contained'
          color='primary'
          onClick={handleNext}
          className={classes.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

export default StepperSection;