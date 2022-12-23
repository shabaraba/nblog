import BlockComponents from './blocks'

export default function Block({entity}: {entity: any}) {

  const BlockComponent = BlockComponents[entity.type]
  return <BlockComponent entity={ entity } />
}


