import React from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {HtmlTooltip} from '../../aggregate/App/styled';
import load21 from './Load21';

function testProducts({editor, type, layer, setContext, handleClose}) {

  function prepare(project) {
    const {props} = project;
    props.loading = true;
    if(type === 'layer' && !layer.layer) {
      layer.clear();
    }
    else {
      project.clear();
      setContext({project, type: 'product', layer: null, elm: null});
    }
    return project;
  }

  function grid100(ev, count) {
    if(typeof count !== 'number') {
      count = 39;
    }

    const step = count > 20 ? 400 : 600;
    const size = step * count;

    const {project} = editor;
    const {props, activeLayer} = prepare(project);
    const profiles = [];
    // стойки
    for(let x = 0; x < size; x += step) {
      const attr = x < size - step ? {b: [x, size], e: [x, step / 2]} : {e: [x, size], b: [x, step / 2]};
      profiles.push(activeLayer.createProfile(attr));
    }
    activeLayer.skeleton.addProfiles(profiles);
    profiles.length = 0;
    // ригели
    for(let x = 0; x < size - step; x += step) {
      // находим примыкающие стойки и сообщаем их узлам
      for(let y = step / 2; y < size; y += step) {
        profiles.push(activeLayer.createProfile({b: [x, size - y], e: [x + step, size - y]}));
      }
    }
    activeLayer.skeleton.addProfiles(profiles);

    props.loading = false;
    props.registerChange();
    project.redraw();
    project.zoomFit();

    handleClose();
  }

  function square(profiles) {
    const {project, DimensionLine} = editor;
    const {props, activeLayer} = prepare(project);
    let i2 = 3;
    if(Array.isArray(profiles)) {
      i2 = 4;
      profiles = profiles.map((attr) => activeLayer.createProfile(attr));
    }
    else {
      profiles = [
        activeLayer.createProfile({b: [1800, 1100], e: [800, 1100]}),
        activeLayer.createProfile({b: [800, 1100], e: [800, 100]}),
        activeLayer.createProfile({b: [800, 100], e: [1800, 100]}),
        activeLayer.createProfile({b: [1800, 100], e: [1800, 1100]}),
      ];
    }
    activeLayer.skeleton.addProfiles(profiles);
    activeLayer.containers.sync();
    new DimensionLine({
      project,
      owner: activeLayer,
      parent: project.dimensions,
      elm1: profiles[0],
      elm2: profiles[0],
      p1: 'b',
      p2: 'e',
      pos: 'bottom',
      offset: -220,
    });
    new DimensionLine({
      project,
      owner: activeLayer,
      parent: project.dimensions,
      elm1: profiles[i2],
      elm2: profiles[i2],
      p1: 'b',
      p2: 'e',
      pos: 'right',
      offset: -240,
    });
    props.loading = false;
    props.registerChange();
    project.redraw();
    project.zoomFit();
    handleClose();
  }

  function clear() {
    const {project} = editor;
    const {props} = project;
    props.loading = true;
    project.clear();
    props.loading = false;
    setContext({stamp: props.stamp, project, type: 'product', layer: null, elm: null});
    handleClose();
  }

  return {
    square,
    imposts() {
      const {project, DimensionLine} = editor;
      const {props, activeLayer} = prepare(project);
      const profiles = [
        activeLayer.createProfile({b: [1400, 1000], e: [100, 1000]}),
        activeLayer.createProfile({b: [100, 1000], e: [100, 0]}),
        activeLayer.createProfile({b: [100, 0], e: [1400, 0]}),
        activeLayer.createProfile({b: [1400, 0], e: [1400, 1000]}),
        activeLayer.createProfile({b: [600, 1000], e: [600, 0]}),
        activeLayer.createProfile({b: [600, 500], e: [1400, 500]}),
      ];
      activeLayer.skeleton.addProfiles(profiles);
      activeLayer.containers.sync();
      activeLayer.containers.children['5_2_3_6'].createChild({kind: 'flap'});
      new DimensionLine({
        project,
        owner: activeLayer,
        parent: project.dimensions,
        elm1: profiles[0],
        elm2: profiles[0],
        p1: 'b',
        p2: 'e',
        pos: 'bottom',
        offset: -220,
      });
      new DimensionLine({
        project,
        owner: activeLayer,
        parent: project.dimensions,
        elm1: profiles[0],
        elm2: profiles[4],
        p1: 'e',
        p2: 'b',
        pos: 'bottom',
        offset: -120,
      });
      new DimensionLine({
        project,
        owner: activeLayer,
        parent: project.dimensions,
        elm1: profiles[3],
        elm2: profiles[3],
        p1: 'b',
        p2: 'e',
        pos: 'right',
        offset: -240,
      });
      new DimensionLine({
        project,
        owner: activeLayer,
        parent: project.dimensions,
        elm1: profiles[5],
        elm2: profiles[3],
        p1: 'b',
        p2: 'e',
        pos: 'right',
        offset: -120,
      });
      props.loading = false;
      props.registerChange();
      project.redraw();
      project.zoomFit();

      handleClose();
    },
    cut() {
      const profiles = [
        {b: [1600, 1000], e: [800, 1000]},
        {b: [800, 1000], e: [0, 1000]},
        {b: [0, 1000], e: [0, 0]},
        {b: [0, 0], e: [1600, 0]},
        {b: [1600, 0], e: [1600, 1000]},
        {b: [800, 1000], e: [800, 0]},
      ];
      return square(profiles);
    },

    grid20() {
      grid100(null, 6);
    },

    grid100,
    clear,
  };
}



export default function TestProducts({editor, type, layer, setContext}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {imposts, square, cut, grid20, grid100, clear} = testProducts({editor, type, layer, setContext, handleClose});

  return <>
    <HtmlTooltip title="Тестовые изделия">
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ArchitectureIcon/>
      </IconButton>
    </HtmlTooltip>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={imposts}>Импосты</MenuItem>
      <MenuItem onClick={square}>Квадрат</MenuItem>
      <MenuItem onClick={cut}>Разрыв</MenuItem>
      <MenuItem onClick={grid20}>Сетка 6</MenuItem>
      <MenuItem onClick={grid100}>Сетка 40</MenuItem>
      <MenuItem onClick={() => load21({editor, setContext, handleClose})}>Из старой базы</MenuItem>
      <MenuItem onClick={clear}>Очистить</MenuItem>
    </Menu>
  </>;
}
