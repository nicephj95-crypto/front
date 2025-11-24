import 'sanitize.css';
import { createGlobalStyle } from 'styled-components';

interface GlobalStyleProps {
  themeName: 'light' | 'dark';
}

export const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => (props.themeName === 'light' ? 'white' : 'black')};
  }

  h1 {
    margin: 0;
  }

  * {
    color: ${({ themeName }) => (themeName === 'light' ? 'black' : 'white')};
  }
`;