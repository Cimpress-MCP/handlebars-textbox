const renderBlock = (block, contentState) => {
  const blockText = block.getText()
  let entities = {}
  return block
    .getCharacterList()
    .reduce((text, c, i) => {
      const entityKey = c.getEntity();
      if (entityKey !== null && contentState.getEntity(entityKey).getType() === 'PLACEHOLDER') {

        if (!entities[entityKey]) {
          entities[entityKey] = true
          const entityData = contentState.getEntity(entityKey).data
          let entityString = entityData.placeholder

          if (entityData.subType === 'open') {
            entityString = `#${entityString}`;
          } else if (entityData.subType === 'close') {
            entityString = `/${entityString}`;
          }
          return text + entityData.escapeHtml ? `{{${entityString}}}` : `{{{${entityString}}}}`;
        }
      }
      return text + blockText[i];
    })
};

export default (contentState) => {
  return contentState
    .getBlocksAsArray()
    .reduce((text, block) => text + renderBlock(block, contentState), '');
};
