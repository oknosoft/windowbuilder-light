import React from 'react';
import PropTypes from 'prop-types';
import TreeItem from '@material-ui/lab/TreeItem';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import cn from 'classnames';

function itemStyles({palette, spacing}) {
  return {
    root: {
      color: palette.text.secondary,
      '&:focus > $content': {
        backgroundColor: 'transparent',
      },
    },
    selected: {
      backgroundColor: `${palette.grey[400]} !important;`,
    },
    content: {
      color: palette.text.secondary,
      borderTopRightRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
      paddingRight: spacing(1),
      // fontWeight: typography.fontWeightMedium,
      // '$expanded > &': {
      //   fontWeight: typography.fontWeightRegular,
      // },
    },
    group: {
      '& $content': {
        paddingLeft: spacing(),
      },
    },
    expanded: {},
    label: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
    labelRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: spacing(0.5, 0),
    },
    labelIcon: {
      marginRight: spacing(1),
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1,
    },
  };
}

function CustomTreeItem(props) {
  const { labelText, LabelIcon, labelInfo, contour, selected, classes, ...other } = props;

  const [hidden, setHidden] = contour ? React.useState(contour.hidden) : [false, null];
  const setChecked = () => {
    contour.hidden = !hidden;
    setHidden(contour.hidden);
  };
  const handleSelect = ({target}) => {
    target.tagName !== 'INPUT' && contour.project._scope.eve.emit('layer_activated', contour);
  }

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {contour && <Checkbox color="primary" checked={!hidden} onChange={setChecked}/>}
          {LabelIcon && <LabelIcon color="inherit" className={classes.labelIcon} />}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          {labelInfo && <input value={labelInfo} />}
        </div>
      }
      classes={{
        root: classes.root,
        content: cn(classes.content, selected && classes.selected),
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      onClick={handleSelect}
      {...other}
    />
  );
}

CustomTreeItem.propTypes = {
  labelText: PropTypes.string,
  LabelIcon: PropTypes.node,
  labelInfo: PropTypes.string,
  contour: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(itemStyles)(CustomTreeItem);



