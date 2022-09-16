import {css} from '@microsoft/fast-element';
import {stylesFontFaces} from '../styles';
import './main.css';

export const MainStyles = css`
  ${stylesFontFaces}
  :host {
    contain: content;

    --nav-height: 60px;
  }

  :host,
  zero-design-system-provider,
  .dynamic-template,
  fast-router {
    display: flex;
    width: 100%;
    height: 100%;
  }
`;
