import SyntaxHighlighter from "react-syntax-highlighter";
import { Box } from '@chakra-ui/react'
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import type { Code as CodeEntity, } from '../../../entities/notion/blocks';

export function Code({entity}: {entity: CodeEntity}) {
  return (
    <Box
      mt={15}
      mb={15}
    >
      <SyntaxHighlighter
        language={entity.language}
        style={atomOneDark}
        wrapLongLines={false}
        showLineNumbers={true}
        customStyle={{
          borderRadius: 5,
          filter: 'drop-shadow(3px 3px 10px rgba(0,0,0,0.2))',
          fontSize: '14px'
        }}
      >
        {entity.texts.map(text => text.content)}
      </SyntaxHighlighter>
    </Box>
  )
}


