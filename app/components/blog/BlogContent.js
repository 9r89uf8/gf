'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ContentWrapper = styled(Box)(({ theme }) => ({
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: 'rgba(15, 23, 42, 0.95)',
    fontWeight: 700,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  '& h2': {
    fontSize: '1.75rem',
  },
  '& h3': {
    fontSize: '1.5rem',
  },
  '& p': {
    color: 'rgba(51, 65, 85, 0.9)',
    lineHeight: 1.8,
    marginBottom: theme.spacing(2),
    fontSize: '1.0625rem',
  },
  '& ul, & ol': {
    color: 'rgba(51, 65, 85, 0.9)',
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    '& li': {
      marginBottom: theme.spacing(1),
      lineHeight: 1.8,
    },
  },
  '& blockquote': {
    borderLeft: '4px solid #1a1a1a',
    paddingLeft: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    fontStyle: 'italic',
    color: 'rgba(71, 85, 105, 0.9)',
    '& p': {
      marginBottom: 0,
    },
  },
  '& a': {
    color: '#1a1a1a',
    textDecoration: 'underline',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'none',
    },
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  '& pre': {
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    border: '1px solid rgba(203, 213, 225, 0.5)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
      fontSize: '0.875rem',
    },
  },
  '& code': {
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.875rem',
    color: 'rgba(15, 23, 42, 0.95)',
  },
  '& hr': {
    border: 'none',
    borderTop: '1px solid rgba(203, 213, 225, 0.5)',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(3),
    '& th, & td': {
      border: '1px solid rgba(203, 213, 225, 0.5)',
      padding: theme.spacing(1.5),
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: 'rgba(241, 245, 249, 0.8)',
      fontWeight: 600,
      color: 'rgba(15, 23, 42, 0.95)',
    },
  },
}));

export default function BlogContent({ content }) {
  // For now, we'll render the content as is
  // In a real implementation, you might want to use a markdown parser
  // or a rich text renderer like react-markdown or @tiptap/react
  
  return (
    <ContentWrapper>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ContentWrapper>
  );
}