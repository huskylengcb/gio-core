import React from 'react';
import SidePanel, { Props as SidePanelProps } from '@gio-design/components/lib/side-panel';
import render, { dataTypes } from './render';

import './style.less';

interface Props {
  data: any
  dataType: dataTypes
}

const DataPanel = (props: Props & SidePanelProps) => {
  const { data, dataType } = props;
  if (!data || !dataType) {
    return null;
  }
  return (
    <SidePanel
      visible={props.visible}
      width={480}
      getContainer={props.getContainer}
      close={props.close}
      content={render(data, dataType)}
    />
  );
}
export default DataPanel;