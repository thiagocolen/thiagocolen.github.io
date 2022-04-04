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
    href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap"
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
