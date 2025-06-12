import React from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {NestedMenuItem} from '@oknosoft/ui/NestedMenu/NestedMenuItem';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import WindowIcon from '../../aggregate/styles/icons/Window';
import GridIcon from '../../aggregate/styles/icons/Grid';
import {HtmlTooltip} from '../../aggregate/App/styled';
import load21 from './Load21';

export function testProducts({editor, type, layer, setContext, handleClose}) {

  function prepare(project, profiles, sys='window') {
    const {props, root: {enm, ui, cch}} = project;
    const offset = new editor.Point();
    props.loading = true;

    const base_sys = cch.predefinedElmnts.find({synonym: 'base_sys'});
    if(base_sys) {
      props.sys = base_sys.elmnts.find({elm: sys}).value;
    }
    if(editor.tool.name !== 'select_node' && sys !== 'stained_glass') {
      editor.tools[0].activate();
    }

    if(type === 'layer' && profiles) {
      return project.standardForms.prepare({layer, profiles});
    }
    else if(type === 'product' && profiles) {
      project.clear();
      props.loading = true;
      setContext({tool: editor.tool});
      const profilesBounds = Array.isArray(profiles) ? project.standardForms.bounds(profiles) : null;
      return Promise.resolve({project, offset: {x: 0, y: 0}, profilesBounds});
    }
    else if(sys !== 'stained_glass') {
      project.clear();
      setContext({project, type: 'product', layer: null, elm: null, tool: editor.tool});
    }
    else {
      setContext({project, type: 'product', layer: null, elm: null});
    }
    return Promise.resolve({project, offset});
  }

  function grid100(ev, count) {
    if(typeof count !== 'number') {
      count = 27;
    }

    const step = count > 20 ? 400 : 600;
    const size = step * count;
    const sizeY = count > 20 ? step * (count - 10) : size;

    const {project} = editor;
    prepare(project)
      .then(({project: {props, workLayer: activeLayer}, offset}) => {
        if(count > 20) {
          project.props.showGrid = false;
        }
        const profiles = [];
        // стойки
        const xMap = new Map();
        for(let x = 0; x < size; x += step) {
          const attr = x < size - step ? {b: [x, sizeY], e: [x, step / 2]} : {e: [x, sizeY], b: [x, step / 2]};
          const profile = activeLayer.createProfile(attr);
          profiles.push(profile);
          xMap.set(x, profile);
        }
        activeLayer.skeleton.addProfiles(profiles);
        profiles.length = 0;
        // ригели
        for(let x = 0; x < size - step; x += step) {
          // находим примыкающие стойки и сообщаем их узлам
          const cnns = {
            b: {profile: xMap.get(x)},
            e: {profile: xMap.get(x + step)},
          }
          for(let y = step / 2; y < sizeY; y += step) {
            profiles.push(activeLayer.createProfile({b: [x, sizeY - y], e: [x + step, sizeY - y], cnns}));
          }
        }
        activeLayer.skeleton.addProfiles(profiles);

        project.redraw();
        props.loading = false;
        props.registerChange();
        project.redraw();
        project.zoomFit();
      })
      .catch(() => null);
    handleClose();
  }

  function square(profiles, nodes, sys) {
    const {project, DimensionLine} = editor;
    if(!Array.isArray(profiles) || !profiles.length) {
      profiles = [
        {b: [1000, 1000], e: [0, 1000]},
        {b: [0, 1000], e: [0, 0]},
        {b: [0, 0], e: [1000, 0]},
        {b: [1000, 0], e: [1000, 1000]},
      ]
    }
    handleClose();
    return prepare(project, profiles, sys)
      .then(({project: {props, workLayer: activeLayer}, offset, profilesBounds}) => {
        profiles = profiles.map((attr) => {
          attr.b[0] += offset.x;
          attr.e[0] += offset.x;
          attr.b[1] += offset.y;
          attr.e[1] += offset.y;
          return activeLayer.createProfile(attr);
        });
        activeLayer.skeleton.addProfiles(profiles, nodes || {'1': 'ad', '2': 'ad', '3': 'ad', '4': 'ad'});
        activeLayer.containers.sync();
        if(offset?.bind !== 'top') {
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
        }
        props.loading = false;
        props.registerChange();
        project.redraw();
        project.zoomFit();
      })
      .catch(() => null);
  }

  function door() {
    return square([
      {b: [900, 2050], e: [0, 2050]},
      {b: [0, 2050], e: [0, 0]},
      {b: [0, 0], e: [900, 0]},
      {b: [900, 0], e: [900, 2050]},
    ], {'1': 'av', '2': 'av', '3': 'ad', '4': 'ad'}, 'door')
      .then(() => {
        const {project, DimensionLine, Path, Point} = editor;
        const {activeLayer, dimensions} = project;
        const profile = activeLayer.profiles[3];
        new DimensionLine({
          project,
          owner: activeLayer,
          parent: dimensions,
          elm1: profile,
          elm2: profile,
          p1: 'b',
          p2: 'e',
          pos: 'right',
          offset: -240,
        });
        const container = activeLayer.fillings[0]?.container;
        const flap = container?.createChild({kind: 'flap'});
        const hor = new Path({insert: false, segments: [[1000, 1330], [-100, 1330]]});
        flap.createProfile({
          b: flap.profiles[1].generatrix.intersectPoint(hor),
          e: flap.profiles[3].generatrix.intersectPoint(hor),
          elmType: project.root.enm.elmTypes.impost,
        });
        flap.defaults();
      });
  }

  function stained_glass() {
    handleClose();
    return prepare(editor.project, null, 'stained_glass')
      .then(({project}) => {
        project.props.showGrid = false;
        const tool = editor.tools[4];
        tool?.activate?.();
        project.redraw();
        setContext({tool});
      });
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
    const top = [
      {b: [700, -1400], e: [300, -1400]},
      {b: [300, -1400], e: [0, -1700]},
      {b: [0, -1700], e: [0, -2100]},
      {b: [0, -2100], e: [300, -2400]},
      {b: [300, -2400], e: [700, -2400]},
      {b: [700, -2400], e: [1000, -2100]},
      {b: [1000, -2100], e: [1000, -1700]},
      {b: [1000, -1700], e: [700, -1400]},
    ];
    prepare(project)
      .then(({project: {props, workLayer: layer}, offset}) => {
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
        // верх
        const topLayer = project.addLayer();
        profiles = top.map((attr) => topLayer.createProfile(attr));
        topLayer.skeleton.addProfiles(profiles);
        topLayer.containers.sync();
        for(const profile of profiles) {
          profile.inset = profiles[1].inset;
        }
        for(const v of topLayer.skeleton.getAllVertices()) {
          v.cnnType = 'ad';
          let cnn;
          for(const cnnPoint of v.cnnPoints) {
            if(!cnnPoint.cnn || !cnnPoint.cnn.cnn_type.is('ad')) {
              if(!cnn) {
                cnn = cnnPoint.cnns.find(v => v.cnn_type.is('ad'));
              }
              cnnPoint.cnn = cnn;
            }
          }
        }
        topLayer.three.parent = layer;
        topLayer.three.bind = 'top';
        topLayer.three.degree.x = -45;
        topLayer.three.position.y = 20;
        topLayer.three.position.z = 20;

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
    door,
    stained_glass,
    imposts() {
      const {project, DimensionLine} = editor;
      prepare(project)
        .then(({project: {props, workLayer: activeLayer}, offset}) => {
          const profiles = [
            activeLayer.createProfile({b: [1400 + offset.x, 1000], e: [offset.x, 1000]}),
            activeLayer.createProfile({b: [offset.x, 1000], e: [offset.x, 0]}),
            activeLayer.createProfile({b: [offset.x, 0], e: [1400 + offset.x, 0]}),
            activeLayer.createProfile({b: [1400 + offset.x, 0], e: [1400 + offset.x, 1000]}),
            activeLayer.createProfile({b: [600 + offset.x, 1000], e: [600 + offset.x, 0]}),
            activeLayer.createProfile({b: [600 + offset.x, 500], e: [1400 + offset.x, 500]}),
          ];
          activeLayer.skeleton.addProfiles(profiles, {'1': 'ad', '2': 'ad', '3': 'ad', '4': 'ad',});
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
      grid100(null, 3);
    },

    grid100,
    clear,
    rotunda,
  };
}



export default function TestProducts({editor, type, layer, setContext, handleClose}) {

  /*
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  */
  const {imposts, square, door, stained_glass, cut, rotunda, grid20, grid100, clear} = testProducts({editor, type, layer, setContext, handleClose});

  return <>
    <MenuItem onClick={square}>
      <ListItemIcon><WindowIcon/></ListItemIcon>
      <ListItemText>Окно</ListItemText>
    </MenuItem>
    <MenuItem onClick={door}>
      <ListItemIcon><MeetingRoomOutlinedIcon/></ListItemIcon>
      <ListItemText>Дверь</ListItemText>
    </MenuItem>
    <MenuItem onClick={stained_glass}>
      <ListItemIcon><GridIcon/></ListItemIcon>
      <ListItemText>Витраж</ListItemText>
    </MenuItem>
    <NestedMenuItem
      label="Отладка"
      parentMenuOpen={open}
      delay={300}>
      <MenuItem onClick={imposts}>Импосты</MenuItem>
      <MenuItem onClick={cut}>Разрыв</MenuItem>
      <MenuItem onClick={grid20}>Сетка 6</MenuItem>
      <MenuItem onClick={grid100}>Сетка 30</MenuItem>
      <MenuItem onClick={rotunda}>Ротонда</MenuItem>
      <MenuItem onClick={() => load21({editor, setContext, handleClose})}>Из старой базы</MenuItem>
      <MenuItem onClick={clear}>Очистить</MenuItem>
    </NestedMenuItem>
  </>;
  /*
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
      slotProps={{
        list: {
          'aria-labelledby': 'basic-button',
        },
        paper: {sx: {minWidth: 200}}
      }}
    >

    </Menu>
  </>;
  */
}
