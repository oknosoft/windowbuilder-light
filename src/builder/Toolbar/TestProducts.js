import React from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {HtmlTooltip} from '../../aggregate/App/styled';

function testProducts({editor, handleClose}) {

  function clear(activeLayer) {
    for(const profile of activeLayer.profiles.reverse()) {
      profile.remove();
    }
    activeLayer.children.dimensions.clear();
    activeLayer.children.dimensions.removeChildren();
    activeLayer.children.visualization.clear();
  }

  function grid100(ev, count) {
    if(typeof count !== 'number') {
      count = 39;
    }

    const step = count > 20 ? 400 : 600;
    const size = step * count;

    const {project} = editor;
    const {activeLayer, props} = project;
    props.loading = true;
    clear(activeLayer);
    const profiles = [];
    // стойки
    for(let x = 0; x < size; x += step) {
      profiles.push(activeLayer.createProfile({b: [x, size], e: [x, step / 2]}));
    }
    for(const profile of profiles) {
      activeLayer.skeleton.addProfile(profile);
    }
    profiles.length = 0;
    // ригели
    for(let x = 0; x < size - step; x += step) {
      for(let y = step / 2; y < size; y += step) {
        profiles.push(activeLayer.createProfile({b: [x, size - y], e: [x + step, size - y]}));
      }
    }
    for(const profile of profiles) {
      activeLayer.skeleton.addProfile(profile);
    }

    props.loading = false;
    project.redraw();
    project.zoomFit();

    handleClose();
  }

  return {
    imposts() {
      const {project} = editor;
      const {activeLayer, props} = project;
      props.loading = true;
      clear(activeLayer);
      const profiles = [
        activeLayer.createProfile({b: [1400, 1000], e: [100, 1000]}),
        activeLayer.createProfile({b: [100, 1000], e: [100, 0]}),
        activeLayer.createProfile({b: [100, 0], e: [1400, 0]}),
        activeLayer.createProfile({b: [1400, 0], e: [1400, 1000]}),
        activeLayer.createProfile({b: [500, 1000], e: [500, 0]}),
        activeLayer.createProfile({b: [700, 1000], e: [800, 0]}),
        activeLayer.createProfile({b: [750, 500], e: [1400, 600]}),
      ];
      for(const profile of profiles) {
        activeLayer.skeleton.addProfile(profile);
      }
      props.loading = false;
      project.redraw();
      project.zoomFit();

      handleClose();
    },

    grid20() {
      grid100(null, 6);
    },

    grid100,
  };
}



export default function TestProducts({editor}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {imposts, grid20, grid100} = testProducts({editor, handleClose});

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
      <MenuItem onClick={grid20}>Сетка 6</MenuItem>
      <MenuItem onClick={grid100}>Сетка 40</MenuItem>
    </Menu>
  </>;
}
