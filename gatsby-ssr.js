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
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
    rel="stylesheet"
  ></link>,
];

const BodyAttributes = { };
// TODO: this classes are not working um prod
// let's remove this and apply locally
// const BodyAttributes = { className: "select-none cursor-default" };


exports.onRenderBody = (
  { setHeadComponents, setHtmlAttributes, setBodyAttributes },
  pluginOptions
) => {
  setHtmlAttributes(HtmlAttributes);
  setHeadComponents(HeadComponents);
  setBodyAttributes(BodyAttributes);
};
