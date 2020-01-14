import styled, { keyframes } from 'styled-components';

export const Button = styled.button``;

export const Error = styled.div`
  color: #ff6666;
  font-weight: bold;
`;

export const Form = styled.form`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: auto;
  max-width: 500px;
  padding: 32px;
`;

export const Label = styled.label``;

export const Input = styled.input``;

export const Spinner = styled.div`
  animation: infinite 600ms ease-in-out ${keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `};
  border-radius: 50%;
  border-right: 4px solid #444;
  height: 20px;
  width: 20px;
`;
