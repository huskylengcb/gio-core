import React, { useRef, useState, useEffect } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import SidePanel, { Props as SidePanelProps } from '@gio-design/components/lib/side-panel';
import Render, { dataTypes } from './render';
import './style.less';
import Button from '@gio-design/components/lib/button';
import Gap from '@gio-design/components/lib/gap';
interface Props {
  data: any
  dataType: dataTypes
  extraData: any
  extraRenders?: any
  disabledOk?: boolean
  disabledTooltip?: string
  onChange?: (data: any) => void
}

const DataPanel = (props: Props & SidePanelProps) => {
  const { data, dataType, extraData, extraRenders,disabledOk } = props;
  if (!data || !dataType) {
    return null;
  }
  const { height: windowHeight } = useWindowSize()
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
      setFooterVisible(false)
    }

  }, [props.data])

  return (
    <SidePanel
      visible={props.visible}
      width={480}
      height={windowHeight - 60}
      getContainer={props.getContainer}
      close={props.close}
      footer={null}
      content={
        <div className='data-panel-container'>
          <Render
            dataType={dataType}
            extraData={extraData}
            data={data}
            onValuesChange={onValuesChange}
            extraRenders={extraRenders}
            disabledOk={disabledOk}
            ref={setFormRef}
          />
          {
            footerVisible && (
              <div className='footer'>
                <Button onClick={handleCancel}>取消</Button>
                <Gap width={16} />
                <Button type='primary' onClick={handleOk} disabled={props.disabledOk}>确定</Button>
              </div>
            )
          }
        </div>
      }
    />
  );
}

export default DataPanel;