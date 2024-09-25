import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {PaddingLeft, HtmlTooltip} from '../../aggregate/App/styled';
import controlsToolbar from './Toolbar';
import ProfileProps from './Panel/ProfileProps';
import PairProps from './Panel/PairProps';
import ManyProps from './Panel/ManyProps';
import LayerProps from './Panel/LayerProps';
import ProductProps from './Panel/ProductProps';
import FillingProps from './Panel/FillingProps';
import Settings from './Panel/Settings';

const previous = {};
const elmTypes = ['elm', 'node'];

export function specifyComponent({elm, layer, editor, project, tool, type, tab, setTab}) {
  let ToolWnd = tool?.constructor?.ToolWnd;
  if(ToolWnd && previous.tool !== tool && tab !== 'tool') {
    setTab('tool');
  }
  if(!ToolWnd && tab === 'tool') {
    setTab('elm');
  }
  previous.tool = tool;

  if(type === 'layer' && previous.type !== 'layer' && tab !== 'layer') {
    setTab('layer');
  }
  if(type === 'product' && previous.type !== 'product') {
    setTab('product');
  }
  if(elmTypes.includes(type) && !elmTypes.includes(previous.type) && tab !== 'elm') {
    setTab('elm');
  }
  previous.type = type;

  if(tab === 'layer' && layer) {
    ToolWnd = LayerProps;
  }
  else if((tab === 'elm') && elm) {
    if(Array.isArray(elm)) {
      ToolWnd = elm.length === 2 ? PairProps : ManyProps;
    }
    else {
      ToolWnd = (elm instanceof editor.Filling || elm instanceof editor.ContainerBlank) ? FillingProps : ProfileProps;
    }
  }
  else if((tab === 'product') && project) {
    ToolWnd = ProductProps;
  }
  else if(type === 'root') {
    ToolWnd = Settings;
  }
  return ToolWnd;
}

export default function ControlsTabs(props) {
  const {tab, setTab} = props;

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const ToolWnd = specifyComponent(props);

  return <>
    <Tabs value={tab} onChange={handleChange}>
      <Tab value="elm" label={<HtmlTooltip title="Свойства элемента">
        <i className="fa fa-puzzle-piece" />
      </HtmlTooltip>} />
      <Tab value="layer" label={<HtmlTooltip title="Свойства слоя">
        <i className="fa fa-object-ungroup" />
      </HtmlTooltip>} />
      <Tab value="product" label={<HtmlTooltip title="Свойства изделия">
        <i className="fa fa-picture-o" />
      </HtmlTooltip>} />
      <Tab value="tool" label={<HtmlTooltip title="Свойства инструмента">
        <i className="fa fa-wrench" />
      </HtmlTooltip>} />
    </Tabs>
    {controlsToolbar(props)}
    <PaddingLeft>
      {ToolWnd ? <ToolWnd {...props}/> : null}
    </PaddingLeft>
  </>;
}
