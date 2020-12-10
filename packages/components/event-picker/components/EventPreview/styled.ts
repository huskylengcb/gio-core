import styled from "styled-components";
export const TitleWrapper = styled.div`
  text-align: left;
  color: #313E75;
  font-size: 12px;
  line-height: 20px;
  margin-top: 16px;
  margin-bottom: 6px;
`;

export const Col = styled.div`
  width: ${(props) => props.width};
  display: inline-block;
  margin-left: ${(props) => props.marginLeft ? "4px" : '0px'}
  text-align: center;
`;

export const DescripitionWrapper = styled.div`
  text-align: left;
  color: #313e75;
  font-size: 12px;
  line-height: 20px;
`;
export const Tag = styled.span`
  display: inline-block;
  padding-right: 8px;
  padding-left: 8px;
  color: #313e75 !important;
  font-family: PingFang SC;
  background-color: #f7f8fc;
  border-radius: 4px;
  cursor: default;
`;
export const QuickViewContent = styled.div`
  color: #313E75;
`;
