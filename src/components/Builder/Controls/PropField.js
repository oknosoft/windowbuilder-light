/**
 * Вариант оформления поля ввода
 *
 * @module PropField
 *
 * Created by Evgeniy Malyarov on 24.02.2020.
 */

import React from 'react';
import DataField from 'metadata-react/DataField';
import withStyles, {extClasses} from 'metadata-react/DataField/stylesPropertyGrid';

function PropField({classes, ...props}) {
  const ext = extClasses(classes);
  return <DataField extClasses={ext} fullWidth isTabular={false} {...props}/>
}

export default withStyles(PropField);
