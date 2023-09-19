
export default function work_centers_task({doc}) {
  const {fields} = doc.work_centers_task.metadata();
  fields.key.type.types.splice(0, 1);
  fields.recipient.type.types.splice(0, 1);
}
