import React from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {withStyles} from '@material-ui/core/styles';

function itemStyles({palette, spacing, typography}) {
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

function addLayers(contours, activeLayer) {
  return contours.length ?
    contours.map((contour) => {
      const key = `l-${contour.cnstr}`;
      return <StyledTreeItem
        key={key}
        nodeId={key}
        labelText={`${contour.layer ? 'Створка' : 'Рама'} №${contour.cnstr}`}
        checked={activeLayer === contour}
      >
        {addLayers(contour.contours, activeLayer)}
      </StyledTreeItem>;
    })
    :
    null;
}

const StyledTreeItem = withStyles(itemStyles)(CustomTreeItem);

export default function TreeLayers(props) {
  const {contours, ox, activeLayer} = props.editor.project;
  const defaultExpanded = ['root'];
  contours.forEach(({cnstr}) => defaultExpanded.push(`l-${cnstr}`));

  return <TreeView
    expanded={defaultExpanded}
    defaultCollapseIcon={<ArrowDropDownIcon />}
    defaultExpandIcon={<ArrowRightIcon />}
    defaultEndIcon={<div style={{ width: 24 }} />}
  >
    <StyledTreeItem nodeId="root" labelText={ox.prod_name(true)} LabelIcon={AccountTreeIcon}>
      {addLayers(contours, activeLayer)}
    </StyledTreeItem>

    <Divider/>
    <StyledTreeItem nodeId="auto_lines" labelText="Авторазмерные линии" checked={true} />
    <StyledTreeItem nodeId="custom_lines" labelText="Доп. размерные линии" checked={true} />
    <StyledTreeItem nodeId="cnns" labelText="Соединители" checked={true} />
    <StyledTreeItem nodeId="visualization" labelText="Визуализация" checked={true} />
    <StyledTreeItem nodeId="txts" labelText="Комментарии" checked={true} />
  </TreeView>;
}

TreeLayers.propTypes = {
  editor: PropTypes.object.isRequired,
};

