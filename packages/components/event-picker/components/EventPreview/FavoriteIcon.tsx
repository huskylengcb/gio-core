import React, { useState } from 'react';
import Icon from '@gio-design/icon';
import message from '@gio-design-old/components/lib/message';
import objectHash from 'object-hash';

const http = require('@gio-core/utils/http').default;

interface IncommingProperty {
  favorites: boolean;
  id: string;
  type: string;
  deleteCache?: (cacheId: string) => void;
}

export default function FavoriteIcon(props: IncommingProperty) {
  const [_isFavorite, setFavorite] = useState(props.favorites);

  // 生成收藏图标
  const iconComponent = _isFavorite ?
    <Icon type='collect' color='rgb(255, 209, 91)' onClick={favorite.bind({}, false, setFavorite, props.id, props.type, props.deleteCache)} /> :
    <Icon type='collect-o' onClick={favorite.bind({}, true, setFavorite, props.id, props.type, props.deleteCache)} />;

  return <div className='event-preview-button-favor'>{iconComponent}</div>;
}

const favorite = (add: boolean, setFavorite: any, id: string, type: string, deleteCache: (cacheId: string) => void) => {
  const url = `/v3/projects/${window.project.id}/user/favorited/${type}/${id}`;
  const method = add ? 'put' : 'delete';
  const msgSuccess = add ? '收藏成功' : '取消收藏成功';
  const msgFailure = add ? '收藏失败' : '取消收藏失败';
  http[method](url).then((res) => {
    message.success(msgSuccess);
    setFavorite(add);
    if (deleteCache) {
      const hashId = objectHash(`/v3/projects/${window.project.id}/${type}/${id}`);
      deleteCache(hashId);
    }
  })
  .catch((e) => {
    // tslint:disable-next-line:no-console
    console.error(e)
    message.error(msgFailure);
  });
}
