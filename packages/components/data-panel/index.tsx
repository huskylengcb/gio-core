import React, { useRef, useState, useEffect } from 'react';
import SidePanel, { Props as SidePanelProps } from '@gio-design/components/lib/side-panel';
import Render, { dataTypes } from './render';
import './style.less';

interface Props {
  data: any
  dataType: dataTypes
  extraData: any
  onChange?: (data: any) => void
}

const DataPanel = (props: Props & SidePanelProps) => {
  const { data, dataType, extraData } = props;
  if (!data || !dataType) {
    return null;
  }

  const [footerVisible, setFooterVisible] = useState(false)
  const formRef = useRef() as any;
  const setFormRef = (form: any) => {
    formRef.current = form;
  }

  const onValuesChange = (changed: boolean) => {
    setFooterVisible(changed)
  }

  const handleOk = () => {
    formRef.current.validateFields((errors: any, values: any) => {
      if (!errors) {
        props.onChange && props.onChange(values)
      }
    });
  }

  const handleCancel = () => {
    formRef.current.resetFields();
    props.close && props.close()
  }

  useEffect(() => {
    if (formRef.current && formRef.current.resetFields) {
      formRef.current.resetFields()
    }

  }, [props.data])

  return (
    <SidePanel
      visible={props.visible}
      width={480}
      getContainer={props.getContainer}
      close={props.close}
      footer={footerVisible ? undefined : null}
      onOk={handleOk}
      onCancel={handleCancel}
      content={
        <Render
          dataType={dataType}
          extraData={extraData}
          data={data}
          onValuesChange={onValuesChange}
          ref={setFormRef}
        />
      }
    />
  );
}

export default DataPanel;