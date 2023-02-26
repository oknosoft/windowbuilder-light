import React from 'react';
import Typography from '@mui/material/Typography';
import { Scheduler } from "@aldabil/react-scheduler";
import {useTitleContext} from '../App';
import { ru } from 'date-fns/locale';

const title = {title: 'Календарь', appTitle: <Typography variant="h6" noWrap>Календарь</Typography>};

export default function SchedulerStub (props) {

  const {setTitle} = useTitleContext();
  React.useEffect(() => setTitle(title), []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return <Scheduler
    view="week"
    locale={ru}
    hourFormat={24}
    events={[
      {
        event_id: 1,
        title: "Event 1",
        start: new Date(today.setHours(10, 50)),
        end: new Date(today.setHours(19, 30)),
      },
      {
        event_id: 2,
        title: "Event 2",
        start: new Date(today.setHours(9, 10)),
        end: new Date(today.setHours(13, 20)),
      },
      {
        event_id: 3,
        title: "Event 3",
        start: new Date(tomorrow.setHours(11, 45)),
        end: new Date(tomorrow.setHours(14, 14)),
      },
    ]}
  />;
}
