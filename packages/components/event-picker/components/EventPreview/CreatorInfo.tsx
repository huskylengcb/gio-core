import React from 'react';
import { get } from 'lodash';
import moment from 'moment';

function CreatorInfo(props: any) {
  const { event } = props;
  const createdAt = get(event, 'createdAt');

  return (
    <span className='creatorInfo'>
      {
        get(event, 'creator') ?
          `${get(event, 'creator')} 创建于 ${moment(createdAt).format('YYYY-MM-DD')}` : null
      }
    </span>
  );
}

export default CreatorInfo;
