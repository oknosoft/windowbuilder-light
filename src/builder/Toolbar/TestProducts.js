import React from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import {HtmlTooltip} from '../../aggregate/App/styled';
import load21 from './Load21';

function testProducts({editor, type, layer, setContext, handleClose}) {

  function prepare(project, profiles) {
    const {props, root: {enm, ui}} = project;
    const list = [enm.positions.left, enm.positions.right];
    const offset = new editor.Point();
    props.loading = true;

    if(type === 'layer' && profiles) {
      return project.standardForms.prepare({layer, profiles})
    }
    else {
      project.clear();
      setContext({project, type: 'product', layer: null, elm: null});
    }
    return Promise.resolve({project, offset});
  }

  function grid100(ev, count) {
    if(typeof count !== 'number') {
      count = 39;
    }

    const step = count > 20 ? 400 : 600;
    const size = step * count;

    const {project} = editor;
    prepare(project)
      .then(({project: {props, activeLayer}, offset}) => {
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
      })
      .catch(() => null);
    handleClose();
  }

  function square(profiles) {
    const {project, DimensionLine} = editor;
    if(!Array.isArray(profiles) || !profiles.length) {
      profiles = [
        {b: [1000, 1000], e: [0, 1000]},
        {b: [0, 1000], e: [0, 0]},
        {b: [0, 0], e: [1000, 0]},
        {b: [1000, 0], e: [1000, 1000]},
      ]
    }
    prepare(project, profiles)
      .then(({project: {props, activeLayer}, offset, profilesBounds}) => {
        profiles = profiles.map((attr) => {
          attr.b[0] += offset.x;
          attr.e[0] += offset.x;
          attr.b[1] += offset.y;
          attr.e[1] += offset.y;
          return activeLayer.createProfile(attr);
        });
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
        props.loading = false;
        props.registerChange();
        project.redraw();
        project.zoomFit();
      })
      .catch(() => null);
    handleClose();
  }

  function rotunda() {
    const {project} = editor;
    const wall = [
      {b: [1000, 2000], e: [0, 2000]},
      {b: [0, 2000], e: [0, 0]},
      {b: [0, 0], e: [1000, 0]},
      {b: [1000, 0], e: [1000, 2000]},
    ];
    const roof = [
      {b: [1000, -300], e: [0, -300]},
      {b: [0, -300], e: [300, -1300]},
      {b: [300, -1300], e: [700, -1300]},
      {b: [700, -1300], e: [1000, -300]},
    ];
    prepare(project)
      .then(({project: {props, activeLayer: layer}, offset}) => {
        let prev = layer;
        let profiles = wall.map((attr) => layer.createProfile(attr));
        layer.skeleton.addProfiles(profiles);
        layer.containers.sync();
        // крыша
        layer = project.addLayer();
        profiles = roof.map((attr) => layer.createProfile(attr));
        layer.skeleton.addProfiles(profiles);
        layer.containers.sync();
        layer.three.parent = prev;
        layer.three.bind = 'top';
        layer.three.degree.x = -45;
        // створка
        prev.fillings[0].container.createChild({kind: 'flap'})
        prev.contours[0].three.degree.y = -75;

        // одна слева
        const leftLayer = project.addLayer();
        profiles = wall.map((attr) => {
          attr.b[0] -= 1300;
          attr.e[0] -= 1300;
          const profile = leftLayer.createProfile(attr);
          attr.b[0] += 1300;
          attr.e[0] += 1300;
          return profile;
        });
        leftLayer.skeleton.addProfiles(profiles);
        leftLayer.containers.sync();
        leftLayer.three.parent = prev;
        leftLayer.three.bind = 'left';
        leftLayer.three.degree.y = -45;
        // крыша слева
        layer = project.addLayer();
        profiles = roof.map((attr) => {
          attr.b[0] -= 1300;
          attr.e[0] -= 1300;
          const profile = layer.createProfile(attr);
          attr.b[0] += 1300;
          attr.e[0] += 1300;
          return profile;
        });
        layer.skeleton.addProfiles(profiles);
        layer.containers.sync();
        layer.three.parent = leftLayer;
        layer.three.bind = 'top';
        layer.three.degree.x = -45;

        for(let i = 0; i < 6; i++) {
          layer = project.addLayer();
          profiles = wall.map((attr) => {
            attr.b[0] += 1300;
            attr.e[0] += 1300;
            return layer.createProfile(attr);
          });
          layer.skeleton.addProfiles(profiles);
          layer.containers.sync();
          layer.three.parent = prev;
          layer.three.bind = 'right';
          layer.three.degree.y = 45;

          // крыша
          const roofLayer = project.addLayer();
          profiles = roof.map((attr) => {
            attr.b[0] += 1300;
            attr.e[0] += 1300;
            return roofLayer.createProfile(attr);
          });
          roofLayer.skeleton.addProfiles(profiles);
          roofLayer.containers.sync();
          roofLayer.three.parent = layer;
          roofLayer.three.bind = 'top';
          roofLayer.three.degree.x = -45;

          prev = layer;
        }

        props.showGrid = false;
        props.loading = false;
        props.registerChange();
        project.redraw();
        project.zoomFit();
      });
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
      prepare(project)
        .then(({project: {props, activeLayer}, offset}) => {
          const profiles = [
            activeLayer.createProfile({b: [1400 + offset.x, 1000], e: [offset.x, 1000]}),
            activeLayer.createProfile({b: [offset.x, 1000], e: [offset.x, 0]}),
            activeLayer.createProfile({b: [offset.x, 0], e: [1400 + offset.x, 0]}),
            activeLayer.createProfile({b: [1400 + offset.x, 0], e: [1400 + offset.x, 1000]}),
            activeLayer.createProfile({b: [600 + offset.x, 1000], e: [600 + offset.x, 0]}),
            activeLayer.createProfile({b: [600 + offset.x, 500], e: [1400 + offset.x, 500]}),
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
        })
        .catch(() => null);
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
    rotunda,
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
  const {imposts, square, cut, rotunda, grid20, grid100, clear} = testProducts({editor, type, layer, setContext, handleClose});

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
      <MenuItem onClick={rotunda}>Ротонда</MenuItem>
      <MenuItem onClick={() => load21({editor, setContext, handleClose})}>Из старой базы</MenuItem>
      <MenuItem onClick={clear}>Очистить</MenuItem>
    </Menu>
  </>;
}
