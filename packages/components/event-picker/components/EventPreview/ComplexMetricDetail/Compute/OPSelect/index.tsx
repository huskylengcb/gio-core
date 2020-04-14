import React, { useRef } from 'react';
import { IExpressionOP } from '../../type';
import Add from '../icon/Add';
import Subtract from '../icon/Subtract';
import Dropdown from '@gio-design/components/lib/dropdown';
import styled from 'styled-components';
import Menu from '@gio-design/components/lib/menu';
import Icon from '@gio-design/icon';

interface Props {
  value: IExpressionOP
  onChange?: (value: any) => void
  conditionIndex: number
  type: string
  disableSelect?: boolean
}

const OPSelect = (props: Props) => {
  const content = (
    <Menu style={{ width: 150, padding: 8}} selectedKeys={[props.value]}>
      <Menu.Item key={IExpressionOP.ADD} >
        <MenuItemWrapper>
          加法
          <IcomWrapper>
            {IExpressionOP.ADD === props.value ? <Icon type='check' color='#1248E9' size='small' /> : null}
          </IcomWrapper>
        </MenuItemWrapper>
      </Menu.Item>
      <Menu.Item key={IExpressionOP.SUBTRACT}>
        <MenuItemWrapper>
          减法
          <IcomWrapper>
            {IExpressionOP.SUBTRACT === props.value ? <Icon type='check' color='#1248E9' size='small' /> : null}
          </IcomWrapper>
        </MenuItemWrapper>
      </Menu.Item>
    </Menu>
  )
  const op = props.value === IExpressionOP.ADD ? <Add /> : <Subtract />
  const preventDefault = (e): any => e.preventDefault()

  return (
    <Wrapper>
      <Dropdown
         overlay={content}
         trigger={['click']}
         disabled={props.disableSelect}
      >
        <a className="ant-dropdown-link" onClick={preventDefault}>
          {op}
        </a>
      </Dropdown>
    </Wrapper>
  );
};

export default OPSelect;

export const Wrapper = styled.div`
  padding: 12px 0;
`
export const MenuItemWrapper = styled.div`
  line-height: 30px;
  display: flex;
  justify-content: space-between;
`

export const IcomWrapper = styled.div`
  display: inline-block;
`
