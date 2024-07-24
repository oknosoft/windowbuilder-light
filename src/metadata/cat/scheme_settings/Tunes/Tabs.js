import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChecklistIcon from '@mui/icons-material/Checklist';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import GroupByIcon from '../../../../styles/icons/GroupBy';
import FunctionIcon from '../../../../styles/icons/Function';
import BrushIcon from '../../../../styles/icons/Brush';
import ListArrowUpIcon from '../../../../styles/icons/ListArrowUp';
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined';
import {disablePermanent} from '../../../../styles/muiTheme';


export default React.forwardRef(({obj, tab, setTab}, ref) => {

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return <Box ref={ref} sx={{ width: '100%' }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={tab}
        onChange={handleChange}
      >
        <Tab
          value="params"
          icon={<BookmarkBorderIcon/>}
          iconPosition="start"
          label="Параметры"
        />
        <Tab
          value="columns"
          icon={<ChecklistIcon/>}
          iconPosition="start"
          label="Колонки"
        />
        <Tab
          value="selection"
          icon={<FilterAltOutlinedIcon/>}
          iconPosition="start"
          label="Отбор"
        />
        <Tab
          value="sorting"
          icon={<SortByAlphaOutlinedIcon/>}
          iconPosition="start"
          label="Сортировка"
        />
        <Tab
          value="grouping"
          icon={<GroupByIcon/>}
          iconPosition="start"
          label="Группировка"
        />
        <Tab
          value="resources"
          icon={<FunctionIcon/>}
          iconPosition="start"
          label="Ресурсы"
        />
        <Tab
          value="appearance"
          icon={<BrushIcon/>}
          iconPosition="start"
          label="Оформление"
        />
        <Tab
          value="variant"
          icon={<ListArrowUpIcon/>}
          iconPosition="start"
          label="Вариант"
        />
      </Tabs>
    </Box>
  </Box>;
});
