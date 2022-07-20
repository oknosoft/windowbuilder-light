import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PropField from 'metadata-react/DataField/PropField';
import useStyles from 'wb-forms/dist/Common/stylesAccordion';

export default function Coordinates({elm, fields, read_only, select_b, select_e}) {
  const {x1, y1, x2, y2} = elm;
  const classes = useStyles();

  return <Accordion square elevation={0} classes={{expanded: classes.rootExpanded}}>
    <AccordionSummary classes={{
      root: classes.summary,
      content: classes.summaryContent,
      expanded: classes.summaryExpanded,
      expandIcon: classes.icon,
    }} expandIcon={<ArrowDropDownIcon />}>
      <FormControl classes={{root: classes.control}}>
        <InputLabel classes={{shrink: classes.lshrink, formControl: classes.lformControl}}>
          Координаты
        </InputLabel>
        <Input
          classes={{root: classes.iroot, input: classes.input}}
          readOnly
          value={`[${x1}, ${y1}], [${x2}, ${y2}]`}
          endAdornment={<InputAdornment position="end" classes={{root: classes.input}}>
            <ArrowDropDownIcon />
          </InputAdornment>}
        />
      </FormControl>
    </AccordionSummary>
    <AccordionDetails classes={{root: classes.details}}>
      <PropField _obj={elm} _fld="x1" _meta={fields.x1} read_only={read_only} onClick={select_b}/>
      <PropField _obj={elm} _fld="y1" _meta={fields.y1} read_only={read_only} onClick={select_b}/>
      <PropField _obj={elm} _fld="x2" _meta={fields.x2} read_only={read_only} onClick={select_e}/>
      <PropField _obj={elm} _fld="y2" _meta={fields.y2} read_only={read_only} onClick={select_e}/>
    </AccordionDetails>
  </Accordion>;

}

Coordinates.propTypes = {
  elm: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  read_only: PropTypes.bool,
  select_b: PropTypes.func,
  select_e: PropTypes.func,
};
