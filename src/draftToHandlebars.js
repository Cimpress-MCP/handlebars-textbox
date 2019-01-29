const renderBlock = (block, contentState) => {
  const blockText = block.getText();
  let currentEntity;
  let lastEntityEnd = 0;
  let res = '';

  block
      .findEntityRanges((c) => {
        const entityKey = c.getEntity();
        if (entityKey !== null && contentState.getEntity(entityKey).getType() === 'PLACEHOLDER') {
          const entityData = contentState.getEntity(entityKey).data;
          let entityString = entityData.placeholder;

          if (entityData.subTypes.includes('open')) {
            entityString = `#${entityString}`;
          } else if (entityData.subTypes.includes('close')) {
            entityString = `/${entityString}`;
          }
          currentEntity = entityData.escapeHtml ? `{{${entityString}}}` : `{{{${entityString}}}}`;
          return true;
        }
        return false;
      }, (start, end) => {
        res += `${blockText.substring(lastEntityEnd, start)}${currentEntity}`;
        lastEntityEnd = end;
      });

  // Add rest of the text after last entity or none...
  res += blockText.substring(lastEntityEnd, blockText.length);
  return res;
};

export default (contentState) => {
  return contentState
      .getBlocksAsArray()
      .reduce((text, block) => text + renderBlock(block, contentState), '');
};
