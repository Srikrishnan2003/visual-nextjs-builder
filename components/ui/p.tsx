import React from 'react';

export const P = React.forwardRef<HTMLParagraphElement, React.HTMLProps<HTMLParagraphElement> & { fontSize?: string }>((props, ref) => {
  const { fontSize, ...rest } = props;
  const style = {
    fontSize: fontSize,
  };
  return <p ref={ref} style={style} {...rest} />;
});

P.displayName = 'P';
