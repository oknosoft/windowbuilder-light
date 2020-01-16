import React from 'react';
import PropTypes from 'prop-types';
import TreeItem from '@material-ui/lab/TreeItem';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

function itemStyles({palette, spacing}) {
  return {
    root: {
      color: palette.text.secondary,
      // '&:focus > $content': {
      //   backgroundColor: `var(--tree-view-bg-color, ${palette.grey[400]})`,
      //   color: 'var(--tree-view-color)',
      // },
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
  const { labelText, LabelIcon, labelInfo, checked, handleChange, classes, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {typeof checked === 'boolean' && <Checkbox color="primary" checked={checked} onChange={handleChange}/>}
          {LabelIcon && <LabelIcon color="inherit" className={classes.labelIcon} />}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          {labelInfo && <input value={labelInfo} />}
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

CustomTreeItem.propTypes = {
  labelText: PropTypes.string,
  LabelIcon: PropTypes.node,
  labelInfo: PropTypes.string,
  checked: PropTypes.bool,
  handleChange: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default withStyles(itemStyles)(CustomTreeItem);



