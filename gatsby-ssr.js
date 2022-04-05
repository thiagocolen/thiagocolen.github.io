const React = require("react");

const HtmlAttributes = {};

const HeadComponents = [
  <link key="1" rel="preconnect" href="https://fonts.googleapis.com" />,
  <link
    key="2"
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossOrigin=""
  />,
  <link
    key="3"
    href="https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  ></link>,
];

const BodyAttributes = {};

exports.onRenderBody = (
  { setHeadComponents, setHtmlAttributes, setBodyAttributes },
  pluginOptions
) => {
  setHtmlAttributes(HtmlAttributes);
  setHeadComponents(HeadComponents);
  setBodyAttributes(BodyAttributes);
};
