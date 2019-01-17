const EntityItems = {
  'PLACEHOLDER': {
    open: (entity) => {
      let openingTag = entity.data.escapeHtml ? '{{' : '{{{';
      if (entity.data.subType === 'open') {
        openingTag += '#';
      } else if (entity.data.subType === 'close') {
        openingTag += '/';
      }
      return `${openingTag}${entity.data.placeholder}`;
    },
    close: (entity) => entity.data.escapeHtml ? '}}' : '}}}',
  },
};

const renderBlock = (block, rawDraftObject) => {
  let handlebarsString = '';
  const entities = {};

  block
      .entityRanges
      .forEach((range) => {
        const entity = rawDraftObject.entityMap[range.key];
        if (EntityItems[entity.type]) {
          entities[range.offset] = Object.assign(entities[range.offset] || {}, {
            open: EntityItems[entity.type].open(entity),
          });

          entities[range.offset + range.length] = Object.assign(entities[range.offset + range.length] || {}, {
            close: EntityItems[entity.type].close(entity),
          });
        }
      });


  let isTagCharacter = false;
  Array.from(block.text)
      .forEach((character, i) => {
        if (entities[i] && entities[i].open) {
          handlebarsString += entities[i].open;
          isTagCharacter = true;
        }

        if (!isTagCharacter) {
          handlebarsString += character;
        }

        if (entities[i] && entities[i].close) {
          handlebarsString += entities[i].close;
          isTagCharacter = false;
        }
      });


  // Close remaining entity tag if present
  const lastEntityIndex = Object.keys(entities).pop();
  if (parseInt(lastEntityIndex, 10) === block.text.length && entities[lastEntityIndex].close) {
    handlebarsString += entities[lastEntityIndex].close;
  }

  return handlebarsString;
};

export default (rawDraftObject) => {
  return rawDraftObject
      .blocks
      .reduce((text, block) => text + renderBlock(block, rawDraftObject), '');
};
