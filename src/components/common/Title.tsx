import { styled } from "styled-components";

interface Props{
    children?: React.ReactNode;
    size?: "large" | "medium" | "small";
    
}

function Title({children, size}: Props) {
    return 
        <TitleStyle>
            {children}
        </TitleStyle>
     ;
}

const TitleStyle = styled.div`
`;

export default Title;