import React from 'react';
import { Button, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';

// The CustomButton component takes in props as button subcomponents
// and populates the necessary fields with appropriate metadata
// and the onClick function(s).
const CustomButton = ({
  title, ariaLabel, id, variant, color, onClick, className, startIcon
}) => {
  return (
    <Tooltip title={title} aria-label={ariaLabel}>
      <Button
        id={id}
        variant={variant}
        color={color}
        onClick={onClick}
        className={className}
        startIcon={startIcon}
      >
        {title}
      </Button>
    </Tooltip>
  )
}

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  startIcon: PropTypes.object,
};

export default CustomButton;
