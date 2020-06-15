import { useState, useEffect } from 'react';

export const useGroups = (initialGroupIds = []) => {
  const [groupIds, setGroupIds] = useState(initialGroupIds);
  const handleGroupIdsChange = (groupId) => {
    const isExist = groupIds.indexOf(groupId) > -1;
    let newGroupIds: string[] = [];
    if (isExist) {
      newGroupIds = groupIds.filter((gId: string) => gId !== groupId && gId !== `fold_${groupId}`);
    } else {
      newGroupIds = [...groupIds, groupId];
    }
    setGroupIds(newGroupIds);
  }
  return {
    groupIds,
    setGroupIds,
    handleGroupIdsChange
  };
}
