const mixinSegoeUI = (style = 'normal', weight = 'normal') => `
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; 
  font-style: ${style};
  font-weight: ${weight};
`;

export const stylesFontFaces = `
  @font-face {
    font-family: Segoe UI;
    font-weight: 300;
    src: local("Segoe UI Semilight"), local("Segoe UI");
  }

  * {
    ${mixinSegoeUI()}
  }
`;

export const mixinCardTitle = mixinSegoeUI('normal', 'bold');

export const stylesHeaders = `
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }
`;
